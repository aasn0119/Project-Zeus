import { IconType } from "react-icons";

type IconProps = {
  IconName: IconType;
  size?: number;
  className?: string;
  loading?: boolean;
  ping?: boolean;
  reduceOpacityOnHover?: boolean;
  onClick?: () => void;
};

const Icon = ({
  IconName,
  className,
  loading,
  onClick,
  ping,
  reduceOpacityOnHover,
  size = 20,
}: IconProps) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative p-3 rounded-full cursor-pointer hover:bg-myBlue ${
        reduceOpacityOnHover ? "hover:bg-opacity-30" : "bg-myBlue "
      }text-white border-2 border-white hover:drop-shadow-lg ${
        loading && "cursor-wait"
      } ${className}`}
    >
      {loading ? "loading" : <IconName size={size} />}

      {ping && (
        <>
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-myPink -top-1 left-7 border-2 border-gray-900"></span>
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-myPink -top-1 left-7 "></span>
        </>
      )}
    </button>
  );
};

export default Icon;
