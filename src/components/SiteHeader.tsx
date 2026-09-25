import Marquee from "./Marquee";
import SiteNav from "./SiteNav";

const TICKER_ITEMS = [
  "Free shipping over ₹1,999",
  "Chapter One — The Founding Edit",
  "Hand block-printed, handloom woven",
  "New: Marigold Floral Kurta",
];

export default function SiteHeader() {
  return (
    <>
      <Marquee items={TICKER_ITEMS} />
      <SiteNav />
    </>
  );
}
