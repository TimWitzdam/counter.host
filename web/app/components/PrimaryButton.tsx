type Props = {
  children: React.ReactNode;
  className?: string;
};

function BaseButton(props: Props) {
  return (
    <button
      className={`rounded-full bg-blue-500 text-white px-8 py-3 flex items-center justify-center ${props.className}`}
    >
      {props.children}
    </button>
  );
}

export default BaseButton;
