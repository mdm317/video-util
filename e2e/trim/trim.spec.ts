import { test, expect, Page, Locator } from "@playwright/test";
import path from "path";
import fs from "fs";
import { formatTime } from "../../lib/utils/format-time";
import messages from "../../messages/en.json";

const drag = async (page: Page, locator: Locator, x: number, y: number) => {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Locator not found");
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  console.log(`Dragging from (${startX}, ${startY})`);
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + x, startY + y);
  await page.mouse.up();
};
const VIDEO_DUTATION = 156;

const TARGET_START_TIME = 30;
const TARGET_END_TIME = 60;
const DURATION_TEXT = messages.Trim.info.duration;
const START_TEXT = messages.Trim.info.start;
const END_TEXT = messages.Trim.info.end;

test("Trim video E2E flow", async ({ page }) => {
  // await page.evaluate(() => {
  //   document.addEventListener("mousemove", (e) => {
  //     let dot = document.getElementById("debug-dot");
  //     if (!dot) {
  //       dot = document.createElement("div");
  //       dot.id = "debug-dot";
  //       dot.style.cssText = `
  //       position: fixed;
  //       width: 10px;
  //       height: 10px;
  //       background: red;
  //       border-radius: 50%;
  //       pointer-events: none;
  //       z-index: 99999;
  //     `;
  //       document.body.appendChild(dot);
  //     }
  //     dot.style.left = e.clientX - 5 + "px";
  //     dot.style.top = e.clientY - 5 + "px";
  //   });
  // });

  // Debug: Print browser console logs
  page.on("console", (msg) => console.log("BROWSER LOG:", msg.text()));

  // 1. Visit the trim page
  await page.goto("/en/trim");

  // 2. Upload video
  const fileInput = page.locator('input[type="file"]');
  const filePath = path.join(__dirname, "test.mp4");
  await fileInput.setInputFiles(filePath);

  // 3. Verify video duration is shown correctly
  const expectedDuration = formatTime(VIDEO_DUTATION);

  const durationCard = page.locator("div.bg-card", {
    has: page.getByText(DURATION_TEXT, { exact: true }),
  });
  await expect(durationCard.getByText(expectedDuration)).toBeVisible();

  // 4. Adjust range handles
  const timeLineView = page.getByTestId("timeline-range-selector");
  const containerBox = await timeLineView.boundingBox();
  if (!containerBox) throw new Error("Container not found");

  // 4-1. Adjust left range
  const leftHandle = page.getByTestId("left-drag");
  const wantedMoveX = (TARGET_START_TIME / VIDEO_DUTATION) * containerBox.width;

  await drag(page, leftHandle, wantedMoveX, 0);

  const startTimeCard = page.locator("div.bg-card", {
    has: page.getByText(START_TEXT, { exact: true }),
  });
  await expect(
    startTimeCard.getByText(formatTime(TARGET_START_TIME)),
  ).toBeVisible();

  // 4-2. Adjust right range
  const rightHandle = page.getByTestId("right-drag");
  const wantedMoveX2 =
    ((VIDEO_DUTATION - TARGET_END_TIME) / VIDEO_DUTATION) * containerBox.width;

  await drag(page, rightHandle, -wantedMoveX2, 0);

  const endTimeCard = page.locator("div.bg-card", {
    has: page.getByText(END_TEXT, { exact: true }),
  });
  await expect(
    endTimeCard.getByText(formatTime(TARGET_END_TIME)),
  ).toBeVisible();

  // 5. Export trimmed video
  const ffmpegArgsPromise = new Promise<string>((resolve) => {
    page.on("console", (msg) => {
      if (msg.type() === "log" && msg.text().startsWith("[trim-video-args]")) {
        resolve(msg.text().replace("[trim-video-args] ", "").trim());
      }
    });
  });

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  const ffmpegArgs = await ffmpegArgsPromise;
  // because we show rounded time
  // It’s hard to check if the video was trimmed properly.
  expect(ffmpegArgs).toEqual(
    "[-ss, 29.967, -to, 60.095, -i, input.mp4, -c, copy, output.mp4]",
  );
  expect(download.suggestedFilename()).toContain(".mp4");

  const outputFilePath = path.join("./e2e/trim", download.suggestedFilename());
  await download.saveAs(outputFilePath);

  expect(fs.existsSync(outputFilePath)).toBe(true);
  fs.unlinkSync(outputFilePath);
});
