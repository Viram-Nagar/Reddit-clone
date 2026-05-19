const FormError = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <span>⚠</span> {message}
    </p>
  );
};

export default FormError;
