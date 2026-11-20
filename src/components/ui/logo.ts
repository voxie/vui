// The logo's geometry in the mark's own units, shared by Logo and LogoLoading.

// Bubble size. A mathematically square 32 bubble reads too tall, so it is slightly wider.
export const bubble = { width: 34, height: 32 };

// Slope in degrees from vertical.
const angle = 33;
// Length of each arm from the vertex. Length 12 and width 6 make a mark about half the size of the container.
const length = 12;
export const strokeWidth = 6;
// Optical compensation: a round terminal reads lighter than a stroke of the same width, so the dot is drawn heavier.
export const dotWidth = strokeWidth * 1.2;
// The heavier dot overshoots the arm's cap, so its center is pulled slightly in and down.
const dotOpticalOffset = 0.1;
// The wide top of the V carries more visual weight, so the mark sits a touch below the bubble's center.
const verticalShift = 0.7;

const radians = (angle * Math.PI) / 180;
const dx = length * Math.sin(radians);
const dy = length * Math.cos(radians);

// Bottom vertex of the V, centered horizontally with the arm centered vertically, then shifted down.
export const vertex = { x: bubble.width / 2, y: bubble.height / 2 + verticalShift + dy / 2 };

export const left = { x: vertex.x - dx, y: vertex.y - dy };
export const dot = { x: vertex.x + dx - dotOpticalOffset, y: vertex.y - dy + dotOpticalOffset };

export const leftPath = `M${left.x} ${left.y}L${vertex.x} ${vertex.y}`;

// Figma drops a zero-length path on SVG import, so the dot is a hairline running down the arm toward the vertex.
const dotSpan = 0.002;
export const dotPath = `M${dot.x} ${dot.y}L${dot.x - dotSpan * Math.sin(radians)} ${dot.y + dotSpan * Math.cos(radians)}`;

export const tailPath = 'M8 36V24H23.825L8 36Z';
