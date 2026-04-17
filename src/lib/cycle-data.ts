
import {
  startOfDay,
  addDays,
  differenceInDays,
  format,
  subDays,
} from 'date-fns';

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';
export type PeriodFlow = 'Light' | 'Medium' | 'Heavy' | 'Tracked';
export type PeriodState = PeriodFlow | 'Predicted' | null;

export interface DailyLog {
  date: string; // "yyyy-MM-dd"
  cycleDay: number;
  phase: CyclePhase;
  period: PeriodState;
  isPredicted: boolean;
  cycleLength: number | null;
  avgCycleLength: number | null;
  avgPeriodLength: number | null;
  cycleVariation: number | null;
  daysLate: number | null;
  energy: string | null;
  feelings: string | null;
  mind: string | null;
  skin: string | null;
  socialLife: string | null;
  spotting: string | null;
  next_period_date: string | null;
}

export interface HistoricalCycle {
  month: string;
  cycleLength: number;
}

export interface CycleInfo {
  currentDay: number;
  currentPhase: CyclePhase;
  currentDate: Date;
  averageCycleLength: number;
  cycleVariation: number;
  averagePeriodLength: number;
  estimatedNextPeriod: Date | null;
  historicalCycles: HistoricalCycle[];
  logs: DailyLog[];
  daysLate: number;
}

export const getPhaseForDay = (
  day: number,
  avgCycleLength: number
): CyclePhase => {
  const ovulationDay = Math.round(avgCycleLength / 2); // Day 14 for 28-day cycle
  if (day >= 1 && day <= 5) return 'Menstrual';
  if (day > 5 && day < ovulationDay - 1) return 'Follicular';
  if (day >= ovulationDay - 1 && day <= ovulationDay + 1) return 'Ovulatory';
  return 'Luteal';
};

// This function is now a fallback and generates data matching the v1 schema.
export const generateCycleData = (): DailyLog[] => {
  const today = startOfDay(new Date());
  const avgCycleLength = 28;
  const avgPeriodLength = 5;
  const cycleVariation = 4;

  // Find the start of the current cycle based on a mock current day
  const currentCycleDayForGeneration = 27;
  const cycleStartDate = subDays(today, currentCycleDayForGeneration - 1);

  const logs: DailyLog[] = [];
  const startDate = subDays(cycleStartDate, 180); // ~6 months past
  const endDate = addDays(cycleStartDate, 180);   // ~6 months future

  let date = startDate;
  let currentCycleStartForLoop = cycleStartDate;
  let cycleLength = avgCycleLength;
  
  while (currentCycleStartForLoop > startDate) {
      cycleLength = avgCycleLength + Math.floor(Math.random() * (cycleVariation + 1)) - (cycleVariation / 2);
      currentCycleStartForLoop = subDays(currentCycleStartForLoop, cycleLength);
  }
   if (currentCycleStartForLoop < startDate) {
      cycleLength = avgCycleLength + Math.floor(Math.random() * (cycleVariation + 1)) - (cycleVariation / 2);
      currentCycleStartForLoop = addDays(currentCycleStartForLoop, cycleLength);
  }


  let nextPeriodStartDate = cycleStartDate;
  while(nextPeriodStartDate < today) {
    nextPeriodStartDate = addDays(nextPeriodStartDate, avgCycleLength);
  }
  const daysLate = differenceInDays(today, nextPeriodStartDate);
  const nextPeriodDateStr = format(nextPeriodStartDate, 'yyyy-MM-dd');

  while(date <= endDate) {
    let dayOfCycle = differenceInDays(date, currentCycleStartForLoop) + 1;
    if (dayOfCycle > cycleLength) {
        currentCycleStartForLoop = addDays(currentCycleStartForLoop, cycleLength);
        dayOfCycle = 1;
        cycleLength = avgCycleLength + Math.floor(Math.random() * (cycleVariation + 1)) - (cycleVariation / 2);
    }
    
    const isPast = date < today;
    const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    let period: PeriodState = null;
    let isPredicted = true;

    if (isPast && dayOfCycle >= 1 && dayOfCycle <= avgPeriodLength) {
        period = 'Tracked'; 
        isPredicted = false;
    } else if (!isPast && dayOfCycle >= 1 && dayOfCycle <= avgPeriodLength) {
        period = 'Predicted';
    }
     if (isToday) {
      period = null;
      isPredicted = false;
    }


    logs.push({
        date: format(date, 'yyyy-MM-dd'),
        cycleDay: dayOfCycle,
        phase: getPhaseForDay(dayOfCycle, avgCycleLength),
        period,
        isPredicted,
        cycleLength,
        avgCycleLength,
        avgPeriodLength,
        cycleVariation,
        daysLate: daysLate > 0 ? daysLate : 0,
        energy: null,
        feelings: null,
        mind: null,
        skin: null,
        socialLife: null,
        spotting: null,
        next_period_date: nextPeriodDateStr
    });
    date = addDays(date, 1);
  }

  return logs;
};


export const getPhaseTips = (phase: CyclePhase) => {
  const tips = {
    Menstrual: {
      skincare:
        'Focus on hydration and calming ingredients like niacinamide. Your skin may be sensitive and dry.',
      exercise:
        'Light activities like yoga, stretching, or walking are best. Listen to your body and rest.',
      diet: 'Iron-rich foods like spinach and lentils are great. Stay hydrated with water and herbal teas.',
      social:
        "It's a great time for introspection and rest. Don't feel pressured to socialize; prioritize self-care.",
    },
    Follicular: {
      skincare:
        "Your skin is getting stronger. It's a good time for exfoliation and trying new products. Estrogen is rising!",
      exercise:
        'Energy levels are increasing. Try cardio, dance classes, or light strength training.',
      diet: 'Focus on lean proteins, fresh vegetables, and whole grains to support your growing energy.',
      social:
        "You'll feel more outgoing and creative. It's a perfect time for brainstorming and social gatherings.",
    },
    Ovulatory: {
      skincare:
        'Your skin is at its peak! Glowy and clear. Maintain a consistent routine and enjoy it.',
      exercise:
        'This is your peak energy phase. High-intensity workouts (HIIT) and strength training are ideal.',
      diet: 'Light and fresh foods are best. Think salads, smoothies, and plenty of fruits.',
      social:
        'Confidence is high. A great time for public speaking, important meetings, or a fun night out.',
    },
    Luteal: {
      skincare:
        'Progesterone rises, which can cause oiliness and breakouts. Use salicylic acid or clay masks.',
      exercise:
        'Energy may start to decline. Shift to moderate-intensity workouts like pilates or swimming.',
      diet: 'Cravings might kick in. Opt for complex carbs and magnesium-rich foods like dark chocolate and nuts.',
      social:
        "You might feel more introverted. It's a good phase for focused work, organizing, and cozy nights in.",
    },
  };
  return tips[phase];
};

export const getPhaseDeepDive = (phase: CyclePhase) => {
  const deepDive = {
    Menstrual: {
      title: 'The Reset: Your Menstrual Phase',
      biology:
        'Your uterine lining is shedding. Estrogen and progesterone are at their lowest point, which can leave you feeling tired and withdrawn.',
      mood: 'You may feel introspective, intuitive, or sensitive. It\'s a time for rest and reflection, not for making big, stressful decisions.',
      physical:
        'Energy is low. You might experience cramps, bloating, and fatigue. Digestion can be sluggish. Your skin may be dry or sensitive.',
      advice:
        'Prioritize rest. Stay warm and hydrated. Gentle movement like stretching can help with cramps. Nourish your body with iron-rich foods.',
    },
    Follicular: {
      title: 'The Rise: Your Follicular Phase',
      biology:
        'Estrogen starts to rise as your body prepares to release an egg. This boosts energy and brain function.',
      mood: "Energy and optimism are on the upswing. You'll feel more creative, open to new ideas, and social. It's a great time for planning and starting projects.",
      physical:
        'Energy levels are increasing daily. Your skin starts to clear up and glow. Digestion gets back to normal.',
      advice:
        "Channel your renewed energy into creative pursuits or new workouts. It's a great time to learn new things and connect with others.",
    },
    Ovulatory: {
      title: 'The Peak: Your Ovulatory Phase',
      biology:
        'Estrogen peaks, and a surge of luteinizing hormone (LH) triggers ovulation—the release of an egg. Testosterone also rises.',
      mood: "This is your 'power' phase. You'll likely feel confident, charismatic, and highly social. Your communication skills are at their sharpest.",
      physical:
        "Peak energy! You'll feel strong and capable. Skin is often at its best. You might feel a slight twinge of pain on one side during ovulation.",
      advice:
        'Schedule important meetings, social events, or public speaking engagements. Tackle your most demanding workouts. You\'re at your most resilient.',
    },
    Luteal: {
      title: 'The Wind-Down: Your Luteal Phase',
      biology:
        'Progesterone rises to prepare the uterus for a potential pregnancy. If no pregnancy occurs, both progesterone and estrogen will fall, leading to PMS.',
      mood: 'In the first half, you might feel calm and focused. As hormones drop, you may experience PMS symptoms like irritability, anxiety, or sadness. Focus on rest and don\'t push yourself.',
      physical:
        'Energy gradually declines. You may experience bloating, cravings, breast tenderness, and breakouts. Listen to your body\'s need for softer movement and rest.',
      advice:
        'Focus on completing tasks and nesting. As energy wanes, switch to more restorative activities. Be patient with yourself and practice self-compassion.',
    },
  };
  return deepDive[phase];
};

export const getDailyMuse = (phase: CyclePhase) => {
  const muses = {
    Menstrual:
      'Rest is not a luxury, it is a necessity. Honor your body\'s need to slow down.',
    Follicular:
      'Embrace the surge of creation. Your energy is a seed; plant it in fertile ground.',
    Ovulatory:
      'You are radiant. Step into the light and share your voice with the world.',
    Luteal:
      'Turn inward and listen. The whispers of your body hold the wisdom you seek.',
  };
  return muses[phase];
};
