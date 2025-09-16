type Props = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

function BaseButton(p: Props) {
  return (
    <button
      className={`rounded-full bg-blue-500 text-white px-8 py-3 flex items-center justify-center ${p.className}`}
      disabled={p.disabled}
    >
      {p.loading ? (
        <div className="w-5 h-5 border-2 border-t-blue-500 border-background rounded-full animate-spin"></div>
      ) : (
        p.children
      )}
    </button>
  );
}

export default BaseButton;
