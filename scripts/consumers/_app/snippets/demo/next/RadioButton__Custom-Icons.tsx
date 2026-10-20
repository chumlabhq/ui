import { RadioButton, RadioGroup } from "@chumlab/ui/radio-button";

const ThumbsUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const EmptyCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

export default function RadioButtonExample() {
  return (
    <div className="space-y-4">
      <div>
        <span id="radio-icon-checkmark" className="text-xs font-medium text-cl-text-secondary">
          Checkmark icon
        </span>
        <RadioGroup
          name="icon-check"
          aria-labelledby="radio-icon-checkmark"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Selected with checkmark"
            checkedIcon={<CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
            uncheckedIcon={<EmptyCircleIcon className="w-3.5 h-3.5 text-cl-text-tertiary" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
          <RadioButton
            value="b"
            label="Another option"
            checkedIcon={<CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
            uncheckedIcon={<EmptyCircleIcon className="w-3.5 h-3.5 text-cl-text-tertiary" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: "text-xs text-cl-text-secondary"
              }
            }
          />
        </RadioGroup>
      </div>
      <div>
        <span id="radio-icon-heart" className="text-xs font-medium text-cl-text-secondary">
          Heart icon with rose color
        </span>
        <RadioGroup
          name="icon-heart"
          aria-labelledby="radio-icon-heart"
          defaultValue="a"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Favorite option"
            checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
          <RadioButton
            value="b"
            label="Alternative"
            checkedIcon={<HeartIcon className="w-3 h-3 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div>
        <span id="radio-icon-star" className="text-xs font-medium text-cl-text-secondary">
          Star icon with amber color
        </span>
        <RadioGroup
          name="icon-star"
          aria-labelledby="radio-icon-star"
          defaultValue="b"
          size="lg"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
        >
          <RadioButton
            value="a"
            label="Basic"
            checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
          <RadioButton
            value="b"
            label="Premium"
            checkedIcon={<StarIcon className="w-3 h-3 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
      <div>
        <span id="radio-icon-thumbs-up" className="text-xs font-medium text-cl-text-secondary">
          Thumbs up icon with green color
        </span>
        <RadioGroup
          name="icon-thumb"
          aria-labelledby="radio-icon-thumbs-up"
          defaultValue="yes"
          size="xl"
          classes={
            {
              root: "",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary"
            }
          }
          orientation="horizontal"
        >
          <RadioButton
            value="yes"
            label="Yes"
            checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
          <RadioButton
            value="maybe"
            label="Maybe"
            checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
          <RadioButton
            value="no"
            label="No"
            checkedIcon={<ThumbsUpIcon className="w-4 h-4 text-white rotate-180" />}
            classes={
              {
                root: "flex items-center gap-2",
                label: "text-sm font-medium text-cl-text",
                description: ""
              }
            }
          />
        </RadioGroup>
      </div>
    </div>
  );
}
