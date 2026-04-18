import { describe, it, expect } from "vitest";
import { getVisiblePages } from "../utils/helpers";

describe("getVisiblePages", () => {
  describe("edge cases", () => {
    it("returns [] when totalPages is 0", () => {
      expect(getVisiblePages(0, 1)).toEqual([]);
    });

    it("returns [] when totalPages is negative", () => {
      expect(getVisiblePages(-1, 1)).toEqual([]);
    });

    it("returns [1] when totalPages is 1", () => {
      expect(getVisiblePages(1, 1)).toEqual([1]);
    });
  });

  describe("no ellipsis (totalPages fits in totalSlots)", () => {
    it("returns all pages when totalPages <= totalSlots", () => {
      // siblingCount=1 → totalSlots = 1*2+5 = 7
      expect(getVisiblePages(7, 4)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("returns all pages when totalPages is exactly 1 fewer than totalSlots", () => {
      expect(getVisiblePages(6, 3)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("left ellipsis only (showLeftEllipsis && !showRightEllipsis) — lines 28-34", () => {
    it("returns [1, ellipsis, ...rightRange] when near the end", () => {
      // totalPages=20, currentPage=18, siblingCount=1
      // leftSiblingIndex = max(18-1,1)=17, rightSiblingIndex = min(18+1,20)=19
      // showLeftEllipsis = 17>2 = true
      // showRightEllipsis = 19 < 20-1=19 → false
      const result = getVisiblePages(20, 18, 1);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe("ellipsis");
      // last element should be 20
      expect(result[result.length - 1]).toBe(20);
      // rightRange should not contain another ellipsis
      expect(result.filter((x) => x === "ellipsis")).toHaveLength(1);
    });

    it("returns correct right range values when near last page", () => {
      // totalPages=15, currentPage=14, siblingCount=1
      // leftSiblingIndex=13, rightSiblingIndex=15
      // showLeftEllipsis=13>2=true, showRightEllipsis=15<14=false
      const result = getVisiblePages(15, 14, 1);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe("ellipsis");
      // rightCount = 3 + 2*1 = 5 → pages 11..15
      const numericPages = result.filter((x): x is number => x !== "ellipsis");
      expect(numericPages).toContain(15);
      expect(numericPages).toContain(11);
    });

    it("works with larger siblingCount near the end", () => {
      // totalPages=30, currentPage=28, siblingCount=2
      // totalSlots = 2*2+5 = 9, 30>9
      // leftSiblingIndex=max(28-2,1)=26, rightSiblingIndex=min(28+2,30)=30
      // showLeftEllipsis=26>2=true, showRightEllipsis=30<29=false
      const result = getVisiblePages(30, 28, 2);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe("ellipsis");
      expect(result[result.length - 1]).toBe(30);
      expect(result.filter((x) => x === "ellipsis")).toHaveLength(1);
    });
  });

  describe("right ellipsis only (!showLeftEllipsis && showRightEllipsis)", () => {
    it("returns [...leftRange, ellipsis, totalPages] when near the beginning", () => {
      // totalPages=20, currentPage=3, siblingCount=1
      // leftSiblingIndex=max(3-1,1)=2, rightSiblingIndex=min(3+1,20)=4
      // showLeftEllipsis=2>2=false, showRightEllipsis=4<19=true
      const result = getVisiblePages(20, 3, 1);
      expect(result[0]).toBe(1);
      expect(result[result.length - 2]).toBe("ellipsis");
      expect(result[result.length - 1]).toBe(20);
      expect(result.filter((x) => x === "ellipsis")).toHaveLength(1);
    });
  });

  describe("both ellipses (showLeftEllipsis && showRightEllipsis)", () => {
    it("returns [1, ellipsis, ...middle, ellipsis, totalPages]", () => {
      // totalPages=20, currentPage=10, siblingCount=1
      // leftSiblingIndex=9, rightSiblingIndex=11
      // showLeftEllipsis=9>2=true, showRightEllipsis=11<19=true
      const result = getVisiblePages(20, 10, 1);
      expect(result[0]).toBe(1);
      expect(result[1]).toBe("ellipsis");
      expect(result[result.length - 2]).toBe("ellipsis");
      expect(result[result.length - 1]).toBe(20);
    });
  });

  describe("currentPage clamping", () => {
    it("clamps currentPage below 1 to 1", () => {
      const resultNeg = getVisiblePages(20, -5, 1);
      const resultNorm = getVisiblePages(20, 1, 1);
      expect(resultNeg).toEqual(resultNorm);
    });

    it("clamps currentPage above totalPages to totalPages", () => {
      const resultOver = getVisiblePages(20, 100, 1);
      const resultNorm = getVisiblePages(20, 20, 1);
      expect(resultOver).toEqual(resultNorm);
    });
  });
});
