import type { CalendarEvent } from '../../components/alfred/data';

export interface OptimizationSuggestion {
  type: 'FOCUS_BLOCK' | 'DENSITY_WARNING';
  message: string;
  start?: string;
  end?: string;
}

export const optimizationEngine = {
  // Analyze events to find gaps for focus blocks
  findFocusBlocks: (events: CalendarEvent[]): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    // Look for gaps of > 2 hours between 9 AM and 6 PM
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const currentEnd = new Date(sortedEvents[i].end).getTime();
      const nextStart = new Date(sortedEvents[i+1].start).getTime();
      
      const gapMs = nextStart - currentEnd;
      const gapHours = gapMs / (1000 * 60 * 60);

      if (gapHours >= 2) {
        suggestions.push({
          type: 'FOCUS_BLOCK',
          message: `TACTICAL_ADVICE: Detected ${gapHours.toFixed(1)}h focus window between ${sortedEvents[i].title} and ${sortedEvents[i+1].title}.`,
          start: sortedEvents[i].end,
          end: sortedEvents[i+1].start
        });
      }
    }

    return suggestions;
  },

  // Calculate meeting density score
  calculateDensityScore: (events: CalendarEvent[]) => {
    const today = new Date().toDateString();
    const todayEvents = events.filter(e => new Date(e.start).toDateString() === today);
    
    const count = todayEvents.length;
    let score = 'OPTIMAL';
    
    if (count > 5) score = 'HIGH_DENSITY';
    if (count > 8) score = 'CRITICAL_LOAD';

    return {
      score,
      count,
      message: `SYSTEM_STATUS: ${score} (${count} active engagements detected for current cycle).`
    };
  }
};
