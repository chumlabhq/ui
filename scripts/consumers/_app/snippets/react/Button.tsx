import { Button, ButtonGroup } from "@chumlab/ui/button";

export default function Actions() {
  return (
    <ButtonGroup>
      <Button
        className="bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-500 dark:hover:bg-indigo-400 shadow-md"
        onClick={() => console.log("clicked")}
      >
        Save Changes
      </Button>
      <Button
        className="border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        Cancel
      </Button>
    </ButtonGroup>
  );
}
