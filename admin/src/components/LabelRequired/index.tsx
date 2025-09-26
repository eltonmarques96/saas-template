import { Label } from "../ui/label";

function LabelRequired({
	children,
	htmlFor,
}: {
	children: React.ReactNode;
	htmlFor?: string;
}) {
	return (
		<Label htmlFor={htmlFor}>
			{children} <span className="text-red-500">*</span>
		</Label>
	);
}

export default LabelRequired;
