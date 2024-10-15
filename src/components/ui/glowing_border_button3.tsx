interface GradientBorderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const GradientBorderButton3: React.FC<GradientBorderButtonProps> = ({ children, onClick }) => {
  return (
    <button
      className="relative px-8 py-4 bg-[#1E1E1E] text-gray-500 rounded-lg overflow-hidden text-lg"
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#3B82F6] to-transparent opacity-50"></div>
        <div className="absolute inset-[1px] rounded-lg bg-[#1E1E1E]"></div>
      </div>
    </button>
  );
};

export default GradientBorderButton3;
