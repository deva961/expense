import { Loader } from "lucide-react";

export const Spinner = () => {
  return (
    <div className="flex items-center space-x-1">
      <Loader className="h-5 w-5 animate-spin" />
      <span>Loading...</span>
    </div>
  );
};
