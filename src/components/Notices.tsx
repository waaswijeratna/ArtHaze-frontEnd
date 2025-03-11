import NoticesContainer from "./NoticesContainer";

export default function Notices() {
    return (
      <div className="relative w-full h-full bg-primary px-3 pb-3 rounded-xl overflow-y-auto scrollbar-hide">
        <NoticesContainer/>
      </div>
    );
}