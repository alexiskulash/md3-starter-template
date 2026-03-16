import { describe, it, expect } from "vitest";
import { parseNaturalLanguage, formatParsedSummary } from "./naturalLanguageParser";

describe("Natural Language Parser", () => {
  describe("parseNaturalLanguage", () => {
    it("should parse 'Team meeting tomorrow at 2pm'", () => {
      const result = parseNaturalLanguage("Team meeting tomorrow at 2pm");
      
      expect(result.title).toContain("Team meeting");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("14:00");
      expect(result.confidence).toBeGreaterThan(0);
    });

    it("should parse 'Lunch with Sarah Friday at 12pm for 1 hour'", () => {
      const result = parseNaturalLanguage("Lunch with Sarah Friday at 12pm for 1 hour");
      
      expect(result.title).toContain("Lunch");
      expect(result.title).toContain("Sarah");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("12:00");
      expect(result.endTime).toBe("13:00");
      expect(result.duration).toBe(1);
    });

    it("should parse 'Doctor appointment next Monday at 2:30pm'", () => {
      const result = parseNaturalLanguage("Doctor appointment next Monday at 2:30pm");
      
      expect(result.title).toContain("Doctor");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("14:30");
    });

    it("should parse 'Meeting today at 9am for 30 minutes'", () => {
      const result = parseNaturalLanguage("Meeting today at 9am for 30 minutes");
      
      expect(result.title).toContain("Meeting");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("09:00");
      expect(result.duration).toBe(0.5);
      expect(result.endTime).toBe("09:30");
    });

    it("should parse calendar name 'Team standup in Work calendar tomorrow at 9am'", () => {
      const result = parseNaturalLanguage("Team standup in Work calendar tomorrow at 9am");
      
      expect(result.title).toContain("Team standup");
      expect(result.calendarName).toBe("Work");
      expect(result.startTime).toBe("09:00");
    });

    it("should parse military time 'Conference call 14:00'", () => {
      const result = parseNaturalLanguage("Conference call 14:00");
      
      expect(result.title).toContain("Conference");
      expect(result.startTime).toBe("14:00");
    });

    it("should parse date with slashes '3/20 Team meeting at 3pm'", () => {
      const result = parseNaturalLanguage("3/20 Team meeting at 3pm");
      
      expect(result.title).toContain("Team meeting");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("15:00");
      
      // Check that the date is March 20
      expect(result.date?.getMonth()).toBe(2); // 0-indexed
      expect(result.date?.getDate()).toBe(20);
    });

    it("should parse month and day 'March 25 Birthday party at 6pm'", () => {
      const result = parseNaturalLanguage("March 25 Birthday party at 6pm");
      
      expect(result.title).toContain("Birthday party");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("18:00");
      
      // Check that the date is March 25
      expect(result.date?.getMonth()).toBe(2); // 0-indexed
      expect(result.date?.getDate()).toBe(25);
    });

    it("should handle empty input gracefully", () => {
      const result = parseNaturalLanguage("");
      
      expect(result.confidence).toBe(0);
      expect(result.title).toBeUndefined();
      expect(result.date).toBeUndefined();
    });

    it("should provide suggestions for incomplete input", () => {
      const result = parseNaturalLanguage("Meeting");
      
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
    });

    it("should parse 'Workshop for 2 hours tomorrow at 10am'", () => {
      const result = parseNaturalLanguage("Workshop for 2 hours tomorrow at 10am");
      
      expect(result.title).toContain("Workshop");
      expect(result.duration).toBe(2);
      expect(result.startTime).toBe("10:00");
      expect(result.endTime).toBe("12:00");
    });

    it("should parse day of week without 'next' keyword", () => {
      const result = parseNaturalLanguage("Monday morning standup at 9am");
      
      expect(result.title).toContain("morning standup");
      expect(result.date).toBeDefined();
      expect(result.startTime).toBe("09:00");
    });
  });

  describe("formatParsedSummary", () => {
    it("should format complete event data", () => {
      const parsed = {
        title: "Team meeting",
        date: new Date(2026, 2, 20),
        startTime: "14:00",
        duration: 1,
        calendarName: "Work",
        confidence: 0.9,
      };

      const summary = formatParsedSummary(parsed);
      
      expect(summary).toContain("Team meeting");
      expect(summary).toContain("Mar 20");
      expect(summary).toContain("2:00 PM");
      expect(summary).toContain("1 hour");
      expect(summary).toContain("Work");
    });

    it("should format partial event data", () => {
      const parsed = {
        title: "Quick meeting",
        startTime: "10:00",
        confidence: 0.5,
      };

      const summary = formatParsedSummary(parsed);
      
      expect(summary).toContain("Quick meeting");
      expect(summary).toContain("10:00 AM");
    });

    it("should handle duration in minutes", () => {
      const parsed = {
        title: "Standup",
        duration: 0.5,
        confidence: 0.5,
      };

      const summary = formatParsedSummary(parsed);
      
      expect(summary).toContain("30 minutes");
    });
  });
});
