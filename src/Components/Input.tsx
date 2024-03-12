type InputProps = {
  name: string;
  value?: string;
  type?: string;
  className?: string;
  onChange?: (e: any) => void;
  onKeyDown?: (e: any) => void;
  disabled?: boolean;
};

const Input = ({
  type = "text",
  name,
  value,
  className,
  disabled,
  onChange,
  onKeyDown,
}: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      placeholder={"Enter " + name}
      className={`flex-1 px-3 py-1 bg-transparent border-2 border-gray-300 rounded-full placeholder-gray-300 ${className}`}
    />
  );
};

export default Input;
