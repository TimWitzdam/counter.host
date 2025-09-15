type Props = {
  children: React.ReactNode;
};

function SecondaryButton(props: Props) {
  return (
    <button className="rounded-full border-2 border-blue-500 text-blue-500 px-6 py-2 flex items-center justify-center">
      {props.children}
    </button>
  );
}

export default SecondaryButton;
