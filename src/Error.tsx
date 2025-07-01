export default function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
      {error.message.split(":")}
    </div>
  );
}
