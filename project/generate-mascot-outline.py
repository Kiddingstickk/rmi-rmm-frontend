from pathlib import Path
import cv2
import numpy as np

# Input and output files
image_path = Path("public/rmmlogo.png")
svg_path = Path("public/mascot-outline.svg")
preview_path = Path("public/mascot-outline-preview.png")

# Read the original PNG, including its transparency
image = cv2.imread(str(image_path), cv2.IMREAD_UNCHANGED)

if image is None:
    raise FileNotFoundError(f"Could not find {image_path}")

if image.ndim != 3 or image.shape[2] != 4:
    raise ValueError("The mascot image must be a transparent PNG with an alpha channel.")

height, width = image.shape[:2]
alpha = image[:, :, 3]

# Extract visible pixels and find their outer contours
mask = np.where(alpha > 24, 255, 0).astype(np.uint8)

contours, _ = cv2.findContours(
    mask,
    cv2.RETR_EXTERNAL,
    cv2.CHAIN_APPROX_SIMPLE
)

if not contours:
    raise ValueError("No visible silhouette was found in the image.")

# Sort contours by area and select the largest one
contours = sorted(contours, key=cv2.contourArea, reverse=True)
main_contour = contours[0]
perimeter = cv2.arcLength(main_contour, True)
print(f"Outline perimeter: {perimeter:.2f}")

# Simplify the contour slightly while retaining its shape
epsilon = 1.0
smooth_contour = cv2.approxPolyDP(
    main_contour,
    epsilon,
    True
)

points = smooth_contour.reshape(-1, 2)

# Build an SVG path using the original image coordinates
path_data = "M " + " L ".join(
    f"{int(x)} {int(y)}" for x, y in points
) + " Z"

svg_content = f'''<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet"
>
    <path
        id="mascot-outline-track"
        d="{path_data}"
        pathLength="1000"
        fill="none"
        stroke="white"
        stroke-width="7"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
'''

svg_path.write_text(svg_content, encoding="utf-8")


# Generate a TypeScript component containing the exact extracted path
tsx_path = Path("src/rmm/components/Loading/MascotTrack.tsx")

tsx_content = f'''import React from 'react';

interface MascotTrackProps {{
  className?: string;
}}

const MascotTrack: React.FC<MascotTrackProps> = ({{ className }}) => (
  <svg
    className={{className}}
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <path
      d="{path_data}"
      pathLength="1000"
      className="mascot-loader-track-base"
    />
    <path
      d="{path_data}"
      pathLength="1000"
      className="mascot-loader-track-runner"
    />
  </svg>
);

export default MascotTrack;
'''

tsx_path.write_text(tsx_content, encoding="utf-8")
print(f"Track component created: {{tsx_path}}")


# Create a visual preview: original mascot + extracted contour
preview = image[:, :, :3].copy()
cv2.polylines(
    preview,
    [smooth_contour],
    isClosed=True,
    color=(0, 255, 255),
    thickness=3,
    lineType=cv2.LINE_AA
)

cv2.imwrite(str(preview_path), preview)

# Report extraction details
x, y, w, h = cv2.boundingRect(main_contour)

print("\nMascot outline generated successfully!")
print(f"Image dimensions: {width} x {height}")
print(f"Contours detected: {len(contours)}")
print(f"Selected contour area: {cv2.contourArea(main_contour):.0f}")
print(f"Outline points: {len(points)}")
print(f"Outline bounds: x={x}, y={y}, width={w}, height={h}")
print(f"\nSVG created: {svg_path}")
print(f"Preview created: {preview_path}")