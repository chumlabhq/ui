import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
  AvatarShimmer,
  AvatarGroupShimmer,
} from "../index";

describe("Avatar", () => {
  describe("Rendering", () => {
    it("renders initials from name", () => {
      render(<Avatar name="John Doe" />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("renders single initial for single-word name", () => {
      render(<Avatar name="John" maxInitials={2} />);

      expect(screen.getByText("JO")).toBeInTheDocument();
    });

    it("respects maxInitials prop", () => {
      render(<Avatar name="John Michael Doe" maxInitials={3} />);

      expect(screen.getByText("JMD")).toBeInTheDocument();
    });

    it("renders image when src provided", () => {
      render(<Avatar src="/test-image.jpg" alt="Test user" />);

      const img = screen.getByAltText("Test user");
      expect(img).toHaveAttribute("src", "/test-image.jpg");
    });

    it("renders fallback when no name or image", () => {
      render(<Avatar fallback={<span data-testid="fallback">?</span>} />);

      expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });

    it("renders shimmer when loading=true", () => {
      render(<Avatar name="John" loading />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading avatar"
      );
      expect(screen.queryByText("JO")).not.toBeInTheDocument();
    });
  });

  describe("Image Handling", () => {
    it("calls onLoad when image loads successfully", async () => {
      const onLoad = vi.fn();
      render(<Avatar src="/test.jpg" alt="User" onLoad={onLoad} />);

      const img = screen.getByAltText("User");
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it("calls onError and shows initials when image fails", async () => {
      const onError = vi.fn();
      render(<Avatar src="/invalid.jpg" name="John Doe" alt="User" onError={onError} />);

      const img = screen.getByAltText("User");
      fireEvent.error(img);

      expect(onError).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });

    it("applies imageConfig props to img element", () => {
      render(
        <Avatar
          src="/test.jpg"
          alt="User"
          imageConfig={{
            loading: "eager",
            decoding: "sync",
            crossOrigin: "anonymous",
          }}
        />
      );

      const img = screen.getByAltText("User");
      expect(img).toHaveAttribute("loading", "eager");
      expect(img).toHaveAttribute("decoding", "sync");
      expect(img).toHaveAttribute("crossorigin", "anonymous");
    });
  });

  describe("Status Indicator", () => {
    it("renders status indicator with simple status", () => {
      render(<Avatar name="John" status="online" />);

      expect(screen.getByLabelText("online")).toBeInTheDocument();
    });

    it("renders status indicator with config object", () => {
      render(
        <Avatar
          name="John"
          status={{ type: "busy", position: "top-left" }}
        />
      );

      expect(screen.getByLabelText("busy")).toBeInTheDocument();
    });

    it("applies custom status color", () => {
      render(
        <Avatar
          name="John"
          status={{ type: "online", color: "#ff0000" }}
        />
      );

      const status = screen.getByLabelText("online");
      expect(status).toHaveStyle({ backgroundColor: "#ff0000" });
    });
  });

  describe("Auto Color", () => {
    it("generates consistent colors for same name", () => {
      const { rerender } = render(<Avatar name="John Doe" autoColor />);
      const container1 = screen.getByRole("img");
      const style1 = container1.style.backgroundColor;

      rerender(<Avatar name="John Doe" autoColor />);
      const container2 = screen.getByRole("img");
      const style2 = container2.style.backgroundColor;

      expect(style1).toBe(style2);
    });

    it("generates different colors for different names", () => {
      const { rerender } = render(<Avatar name="John" autoColor />);
      const style1 = screen.getByRole("img").style.backgroundColor;

      rerender(<Avatar name="Jane" autoColor />);
      const style2 = screen.getByRole("img").style.backgroundColor;

      // Colors should be different (statistically likely)
      expect(style1).not.toBe(style2);
    });
  });

  describe("Sizes and Shapes", () => {
    it("applies size md by default", () => {
      render(<Avatar name="John" />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ width: "40px", height: "40px" });
    });

    it("applies custom numeric size", () => {
      render(<Avatar name="John" size={100} />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ width: "100px", height: "100px" });
    });

    it("applies circle shape by default", () => {
      render(<Avatar name="John" />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ borderRadius: "9999px" });
    });

    it("applies square shape", () => {
      render(<Avatar name="John" shape="square" />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ borderRadius: "0px" });
    });

    it("applies rounded shape", () => {
      render(<Avatar name="John" shape="rounded" />);

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ borderRadius: "6px" });
    });
  });

  describe("Border", () => {
    it("applies border when bordered=true", () => {
      render(<Avatar name="John" bordered />);

      const avatar = screen.getByRole("img");
      expect(avatar.style.border).toContain("2px solid");
    });

    it("applies custom border string", () => {
      render(<Avatar name="John" bordered="3px dashed red" />);

      const avatar = screen.getByRole("img");
      expect(avatar.style.border).toBe("3px dashed red");
    });
  });

  describe("Accessibility", () => {
    it("has role=img when showing initials", () => {
      render(<Avatar name="John Doe" />);

      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("uses name as aria-label by default", () => {
      render(<Avatar name="John Doe" />);

      expect(screen.getByRole("img")).toHaveAttribute("aria-label", "John Doe");
    });

    it("uses alt as aria-label when provided", () => {
      render(<Avatar name="John" alt="Profile picture" />);

      expect(screen.getByRole("img")).toHaveAttribute(
        "aria-label",
        "Profile picture"
      );
    });

    it("uses custom aria-label when provided", () => {
      render(<Avatar name="John" aria-label="Custom label" />);

      expect(screen.getByRole("img")).toHaveAttribute(
        "aria-label",
        "Custom label"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to container element", () => {
      const ref = vi.fn();
      render(<Avatar name="John" ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("AvatarBadge", () => {
  describe("Rendering", () => {
    it("renders count badge", () => {
      render(<AvatarBadge count={5} />);

      expect(screen.getByRole("status")).toHaveTextContent("5");
    });

    it("renders dot badge when dot=true", () => {
      render(<AvatarBadge dot />);

      const badge = screen.getByRole("status");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("");
    });

    it("shows max+ when count exceeds max", () => {
      render(<AvatarBadge count={150} max={99} />);

      expect(screen.getByRole("status")).toHaveTextContent("99+");
    });

    it("does not render when count is 0 and showZero=false", () => {
      render(<AvatarBadge count={0} />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("renders when count is 0 and showZero=true", () => {
      render(<AvatarBadge count={0} showZero />);

      expect(screen.getByRole("status")).toHaveTextContent("0");
    });

    it("does not render when invisible=true", () => {
      render(<AvatarBadge count={5} invisible />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("applies solid variant by default", () => {
      render(<AvatarBadge count={5} />);

      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("bg-red-500");
    });

    it("applies outline variant", () => {
      render(<AvatarBadge count={5} variant="outline" />);

      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("border-2");
    });

    it("applies soft variant", () => {
      render(<AvatarBadge count={5} variant="soft" />);

      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("bg-red-100");
    });
  });

  describe("Pulse Animation", () => {
    it("applies pulse class when pulse=true", () => {
      render(<AvatarBadge count={5} pulse />);

      expect(screen.getByRole("status")).toHaveClass("animate-pulse");
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-label for count", () => {
      render(<AvatarBadge count={5} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "5 notifications"
      );
    });

    it("has correct aria-label for single notification", () => {
      render(<AvatarBadge count={1} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "1 notification"
      );
    });

    it("has correct aria-label for dot", () => {
      render(<AvatarBadge dot />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "New notification"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to badge element", () => {
      const ref = vi.fn();
      render(<AvatarBadge count={5} ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLSpanElement);
    });
  });
});

describe("AvatarGroup", () => {
  describe("Rendering", () => {
    it("renders all children when no max", () => {
      render(
        <AvatarGroup>
          <Avatar name="John" />
          <Avatar name="Jane" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );

      expect(screen.getByText("JO")).toBeInTheDocument();
      expect(screen.getByText("JA")).toBeInTheDocument();
      expect(screen.getByText("BO")).toBeInTheDocument();
    });

    it("limits visible avatars when max is set", () => {
      render(
        <AvatarGroup max={2}>
          <Avatar name="John" />
          <Avatar name="Jane" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );

      expect(screen.getByText("JO")).toBeInTheDocument();
      expect(screen.getByText("JA")).toBeInTheDocument();
      expect(screen.queryByText("BO")).not.toBeInTheDocument();
    });

    it("shows surplus count when max exceeded", () => {
      render(
        <AvatarGroup max={2}>
          <Avatar name="John" />
          <Avatar name="Jane" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );

      expect(screen.getByText("+1")).toBeInTheDocument();
    });

    it("shows total-based surplus when total prop provided", () => {
      render(
        <AvatarGroup max={2} total={10}>
          <Avatar name="John" />
          <Avatar name="Jane" />
        </AvatarGroup>
      );

      expect(screen.getByText("+8")).toBeInTheDocument();
    });
  });

  describe("Custom Surplus", () => {
    it("renders custom surplus element", () => {
      render(
        <AvatarGroup
          max={2}
          renderSurplus={(count) => (
            <span data-testid="custom-surplus">{count} more</span>
          )}
        >
          <Avatar name="John" />
          <Avatar name="Jane" />
          <Avatar name="Bob" />
          <Avatar name="Alice" />
        </AvatarGroup>
      );

      expect(screen.getByTestId("custom-surplus")).toHaveTextContent("2 more");
    });
  });

  describe("Click Handling", () => {
    it("calls onAvatarClick with correct index", async () => {
      const user = userEvent.setup();
      const onAvatarClick = vi.fn();

      render(
        <AvatarGroup onAvatarClick={onAvatarClick}>
          <Avatar name="John" />
          <Avatar name="Jane" />
        </AvatarGroup>
      );

      await user.click(screen.getByText("JA"));

      expect(onAvatarClick).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  describe("Props Inheritance", () => {
    it("passes size to children", () => {
      render(
        <AvatarGroup size="lg">
          <Avatar name="John" />
        </AvatarGroup>
      );

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ width: "48px", height: "48px" });
    });

    it("passes shape to children", () => {
      render(
        <AvatarGroup shape="square">
          <Avatar name="John" />
        </AvatarGroup>
      );

      const avatar = screen.getByRole("img");
      expect(avatar).toHaveStyle({ borderRadius: "0px" });
    });
  });

  describe("Accessibility", () => {
    it("has role=group", () => {
      render(
        <AvatarGroup>
          <Avatar name="John" />
        </AvatarGroup>
      );

      expect(screen.getByRole("group")).toBeInTheDocument();
    });

    it("has descriptive aria-label", () => {
      render(
        <AvatarGroup max={2}>
          <Avatar name="John" />
          <Avatar name="Jane" />
          <Avatar name="Bob" />
        </AvatarGroup>
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Avatar group with 3 members, 1 more not shown"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to container", () => {
      const ref = vi.fn();
      render(
        <AvatarGroup ref={ref}>
          <Avatar name="John" />
        </AvatarGroup>
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("AvatarGroupCount", () => {
  describe("Rendering", () => {
    it("renders count with plus prefix by default", () => {
      render(<AvatarGroupCount count={5} />);

      expect(screen.getByRole("status")).toHaveTextContent("+5");
    });

    it("renders without plus when showPlus=false", () => {
      render(<AvatarGroupCount count={5} showPlus={false} />);

      expect(screen.getByRole("status")).toHaveTextContent("5");
    });

    it("shows max+ when count exceeds max", () => {
      render(<AvatarGroupCount count={150} max={99} />);

      expect(screen.getByRole("status")).toHaveTextContent("+99+");
    });

    it("uses custom format function", () => {
      render(
        <AvatarGroupCount count={5} format={(n) => `${n} users`} />
      );

      expect(screen.getByRole("status")).toHaveTextContent("5 users");
    });
  });

  describe("Click Handling", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<AvatarGroupCount count={5} onClick={onClick} />);

      await user.click(screen.getByRole("status"));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("shows pointer cursor when onClick provided", () => {
      render(<AvatarGroupCount count={5} onClick={() => {}} />);

      expect(screen.getByRole("status")).toHaveClass("cursor-pointer");
    });
  });

  describe("Variants", () => {
    it("applies solid variant by default", () => {
      render(<AvatarGroupCount count={5} />);

      expect(screen.getByRole("status")).toHaveClass("bg-gray-200");
    });

    it("applies outline variant", () => {
      render(<AvatarGroupCount count={5} variant="outline" />);

      expect(screen.getByRole("status")).toHaveClass("border-2");
    });

    it("applies ghost variant", () => {
      render(<AvatarGroupCount count={5} variant="ghost" />);

      expect(screen.getByRole("status")).not.toHaveClass("bg-gray-200");
      expect(screen.getByRole("status")).not.toHaveClass("border-2");
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-label", () => {
      render(<AvatarGroupCount count={5} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "5 more members not shown"
      );
    });

    it("has singular aria-label for count of 1", () => {
      render(<AvatarGroupCount count={1} />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "1 more member not shown"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to container", () => {
      const ref = vi.fn();
      render(<AvatarGroupCount count={5} ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("AvatarShimmer", () => {
  describe("Rendering", () => {
    it("renders loading state", () => {
      render(<AvatarShimmer />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading avatar"
      );
    });

    it("applies animate class by default", () => {
      render(<AvatarShimmer />);

      expect(screen.getByRole("status")).toHaveClass("animate-pulse");
    });

    it("does not animate when animate=false", () => {
      render(<AvatarShimmer animate={false} />);

      expect(screen.getByRole("status")).not.toHaveClass("animate-pulse");
    });
  });

  describe("Sizes", () => {
    it("applies default md size", () => {
      render(<AvatarShimmer />);

      expect(screen.getByRole("status")).toHaveStyle({
        width: "40px",
        height: "40px",
      });
    });

    it("applies custom size", () => {
      render(<AvatarShimmer size="xl" />);

      expect(screen.getByRole("status")).toHaveStyle({
        width: "64px",
        height: "64px",
      });
    });
  });

  describe("Shapes", () => {
    it("applies circle shape by default", () => {
      render(<AvatarShimmer />);

      expect(screen.getByRole("status")).toHaveStyle({
        borderRadius: "9999px",
      });
    });

    it("applies square shape", () => {
      render(<AvatarShimmer shape="square" />);

      expect(screen.getByRole("status")).toHaveStyle({
        borderRadius: "0px",
      });
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref", () => {
      const ref = vi.fn();
      render(<AvatarShimmer ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe("AvatarGroupShimmer", () => {
  describe("Rendering", () => {
    it("renders multiple shimmer items", () => {
      render(<AvatarGroupShimmer count={4} />);

      const container = screen.getByRole("status");
      expect(container.children).toHaveLength(4);
    });

    it("renders 3 items by default", () => {
      render(<AvatarGroupShimmer />);

      const container = screen.getByRole("status");
      expect(container.children).toHaveLength(3);
    });

    it("shows count shimmer when showCount=true", () => {
      render(<AvatarGroupShimmer count={2} showCount />);

      const container = screen.getByRole("status");
      expect(container.children).toHaveLength(3); // 2 avatars + 1 count
    });
  });

  describe("Accessibility", () => {
    it("has correct aria-label", () => {
      render(<AvatarGroupShimmer />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading avatar group"
      );
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref", () => {
      const ref = vi.fn();
      render(<AvatarGroupShimmer ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});
