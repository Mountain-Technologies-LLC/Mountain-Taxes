/**
 * Mountain Taxes Calculator - State Tax Data
 * 
 * Comprehensive state income tax data based on Tax Foundation 2025 rates.
 * This file contains hardcoded tax information for all 50 US states including
 * filing types, standard deductions, personal exemptions, and tax brackets.
 */

import { State, FilingTypeName } from './types';
import { StateDataValidator, ErrorHandler, ErrorSeverity } from './validation';

/**
 * Complete state tax data for all 50 US states
 * Data sourced from Tax Foundation 2025 state income tax rates
 */
export const STATE_TAX_DATA: State[] = [
    {
        name: "Alabama",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2500,
                personalExemption: 1500,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 500, rate: 0.04 },
                    { bracket: 3000, rate: 0.05 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 7500,
                personalExemption: 3000,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 1000, rate: 0.04 },
                    { bracket: 6000, rate: 0.05 }
                ]
            }
        ]
    },
    {
        name: "Alaska",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "Arizona",
        dependentDeduction: 100,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.025 },
                    { bracket: 27272, rate: 0.0312 },
                    { bracket: 54544, rate: 0.0417 },
                    { bracket: 163632, rate: 0.045 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.025 },
                    { bracket: 54544, rate: 0.0312 },
                    { bracket: 109088, rate: 0.0417 },
                    { bracket: 327264, rate: 0.045 }
                ]
            }
        ]
    },
    {
        name: "Arkansas",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2340,
                personalExemption: 29,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 4300, rate: 0.04 },
                    { bracket: 8500, rate: 0.059 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 4680,
                personalExemption: 58,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 4300, rate: 0.04 },
                    { bracket: 8500, rate: 0.059 }
                ]
            }
        ]
    },
    {
        name: "California",
        dependentDeduction: 446,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 5202,
                personalExemption: 154,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 10099, rate: 0.02 },
                    { bracket: 23942, rate: 0.04 },
                    { bracket: 37788, rate: 0.06 },
                    { bracket: 52455, rate: 0.08 },
                    { bracket: 66295, rate: 0.093 },
                    { bracket: 338639, rate: 0.103 },
                    { bracket: 406364, rate: 0.113 },
                    { bracket: 677278, rate: 0.123 },
                    { bracket: 1000000, rate: 0.133 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 10404,
                personalExemption: 308,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 20198, rate: 0.02 },
                    { bracket: 47884, rate: 0.04 },
                    { bracket: 75576, rate: 0.06 },
                    { bracket: 104910, rate: 0.08 },
                    { bracket: 132590, rate: 0.093 },
                    { bracket: 677278, rate: 0.103 },
                    { bracket: 812728, rate: 0.113 },
                    { bracket: 1000000, rate: 0.123 },
                    { bracket: 1354556, rate: 0.133 }
                ]
            }
        ]
    },
    {
        name: "Colorado",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0440 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0440 }
                ]
            }
        ]
    },
    {
        name: "Connecticut",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 15000,
                taxBrackets: [
                    { bracket: 0, rate: 0.03 },
                    { bracket: 10000, rate: 0.05 },
                    { bracket: 50000, rate: 0.055 },
                    { bracket: 100000, rate: 0.06 },
                    { bracket: 200000, rate: 0.065 },
                    { bracket: 250000, rate: 0.069 },
                    { bracket: 500000, rate: 0.0699 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 24000,
                taxBrackets: [
                    { bracket: 0, rate: 0.03 },
                    { bracket: 20000, rate: 0.05 },
                    { bracket: 100000, rate: 0.055 },
                    { bracket: 200000, rate: 0.06 },
                    { bracket: 400000, rate: 0.065 },
                    { bracket: 500000, rate: 0.069 },
                    { bracket: 1000000, rate: 0.0699 }
                ]
            }
        ]
    },
    {
        name: "Delaware",
        dependentDeduction: 110,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 3250,
                personalExemption: 110,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 2000, rate: 0.022 },
                    { bracket: 5000, rate: 0.039 },
                    { bracket: 10000, rate: 0.048 },
                    { bracket: 20000, rate: 0.052 },
                    { bracket: 25000, rate: 0.0555 },
                    { bracket: 60000, rate: 0.066 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 6500,
                personalExemption: 220,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 2000, rate: 0.022 },
                    { bracket: 5000, rate: 0.039 },
                    { bracket: 10000, rate: 0.048 },
                    { bracket: 20000, rate: 0.052 },
                    { bracket: 25000, rate: 0.0555 },
                    { bracket: 60000, rate: 0.066 }
                ]
            }
        ]
    },
    {
        name: "Florida",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "Georgia",
        dependentDeduction: 3000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 2700,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 750, rate: 0.02 },
                    { bracket: 2250, rate: 0.03 },
                    { bracket: 3750, rate: 0.04 },
                    { bracket: 5250, rate: 0.05 },
                    { bracket: 7000, rate: 0.0575 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 5400,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 1000, rate: 0.02 },
                    { bracket: 3000, rate: 0.03 },
                    { bracket: 5000, rate: 0.04 },
                    { bracket: 7000, rate: 0.05 },
                    { bracket: 10000, rate: 0.0575 }
                ]
            }
        ]
    },
    {
        name: "Hawaii",
        dependentDeduction: 1144,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2200,
                personalExemption: 1144,
                taxBrackets: [
                    { bracket: 0, rate: 0.014 },
                    { bracket: 2400, rate: 0.032 },
                    { bracket: 4800, rate: 0.055 },
                    { bracket: 9600, rate: 0.064 },
                    { bracket: 14400, rate: 0.068 },
                    { bracket: 19200, rate: 0.072 },
                    { bracket: 24000, rate: 0.076 },
                    { bracket: 36000, rate: 0.079 },
                    { bracket: 48000, rate: 0.0825 },
                    { bracket: 150000, rate: 0.09 },
                    { bracket: 175000, rate: 0.10 },
                    { bracket: 200000, rate: 0.11 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 4400,
                personalExemption: 2288,
                taxBrackets: [
                    { bracket: 0, rate: 0.014 },
                    { bracket: 4800, rate: 0.032 },
                    { bracket: 9600, rate: 0.055 },
                    { bracket: 19200, rate: 0.064 },
                    { bracket: 28800, rate: 0.068 },
                    { bracket: 38400, rate: 0.072 },
                    { bracket: 48000, rate: 0.076 },
                    { bracket: 72000, rate: 0.079 },
                    { bracket: 96000, rate: 0.0825 },
                    { bracket: 300000, rate: 0.09 },
                    { bracket: 350000, rate: 0.10 },
                    { bracket: 400000, rate: 0.11 }
                ]
            }
        ]
    },
    {
        name: "Idaho",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 1568, rate: 0.03 },
                    { bracket: 3136, rate: 0.045 },
                    { bracket: 4704, rate: 0.06 },
                    { bracket: 6272, rate: 0.069 },
                    { bracket: 7840, rate: 0.069 },
                    { bracket: 11760, rate: 0.069 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 3136, rate: 0.03 },
                    { bracket: 6272, rate: 0.045 },
                    { bracket: 9408, rate: 0.06 },
                    { bracket: 12544, rate: 0.069 },
                    { bracket: 15680, rate: 0.069 },
                    { bracket: 23520, rate: 0.069 }
                ]
            }
        ]
    },
    {
        name: "Illinois",
        dependentDeduction: 2375,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 2375,
                taxBrackets: [
                    { bracket: 0, rate: 0.0495 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 4750,
                taxBrackets: [
                    { bracket: 0, rate: 0.0495 }
                ]
            }
        ]
    },
    {
        name: "Indiana",
        dependentDeduction: 1500,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 1500,
                taxBrackets: [
                    { bracket: 0, rate: 0.0315 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 3000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0315 }
                ]
            }
        ]
    },
    {
        name: "Iowa",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2130,
                personalExemption: 40,
                taxBrackets: [
                    { bracket: 0, rate: 0.0033 },
                    { bracket: 1743, rate: 0.0067 },
                    { bracket: 3486, rate: 0.0225 },
                    { bracket: 6972, rate: 0.0414 },
                    { bracket: 15687, rate: 0.0563 },
                    { bracket: 26145, rate: 0.0596 },
                    { bracket: 34860, rate: 0.0625 },
                    { bracket: 52290, rate: 0.0744 },
                    { bracket: 78435, rate: 0.0853 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 5240,
                personalExemption: 80,
                taxBrackets: [
                    { bracket: 0, rate: 0.0033 },
                    { bracket: 1743, rate: 0.0067 },
                    { bracket: 3486, rate: 0.0225 },
                    { bracket: 6972, rate: 0.0414 },
                    { bracket: 15687, rate: 0.0563 },
                    { bracket: 26145, rate: 0.0596 },
                    { bracket: 34860, rate: 0.0625 },
                    { bracket: 52290, rate: 0.0744 },
                    { bracket: 78435, rate: 0.0853 }
                ]
            }
        ]
    },
    {
        name: "Kansas",
        dependentDeduction: 2500,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 3500,
                personalExemption: 2500,
                taxBrackets: [
                    { bracket: 0, rate: 0.031 },
                    { bracket: 15000, rate: 0.0525 },
                    { bracket: 30000, rate: 0.057 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 8000,
                personalExemption: 5000,
                taxBrackets: [
                    { bracket: 0, rate: 0.031 },
                    { bracket: 30000, rate: 0.0525 },
                    { bracket: 60000, rate: 0.057 }
                ]
            }
        ]
    },
    {
        name: "Kentucky",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2770,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.05 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 5540,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.05 }
                ]
            }
        ]
    },
    {
        name: "Louisiana",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 4500,
                taxBrackets: [
                    { bracket: 0, rate: 0.0185 },
                    { bracket: 12500, rate: 0.035 },
                    { bracket: 50000, rate: 0.0425 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 9000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0185 },
                    { bracket: 25000, rate: 0.035 },
                    { bracket: 100000, rate: 0.0425 }
                ]
            }
        ]
    },
    {
        name: "Maine",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 4450,
                taxBrackets: [
                    { bracket: 0, rate: 0.058 },
                    { bracket: 23000, rate: 0.0675 },
                    { bracket: 54450, rate: 0.0715 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 8900,
                taxBrackets: [
                    { bracket: 0, rate: 0.058 },
                    { bracket: 46000, rate: 0.0675 },
                    { bracket: 108900, rate: 0.0715 }
                ]
            }
        ]
    },
    {
        name: "Maryland",
        dependentDeduction: 3200,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2400,
                personalExemption: 3200,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 1000, rate: 0.03 },
                    { bracket: 2000, rate: 0.04 },
                    { bracket: 3000, rate: 0.0475 },
                    { bracket: 100000, rate: 0.05 },
                    { bracket: 125000, rate: 0.0525 },
                    { bracket: 150000, rate: 0.055 },
                    { bracket: 250000, rate: 0.0575 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 4800,
                personalExemption: 6400,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 1000, rate: 0.03 },
                    { bracket: 2000, rate: 0.04 },
                    { bracket: 3000, rate: 0.0475 },
                    { bracket: 150000, rate: 0.05 },
                    { bracket: 175000, rate: 0.0525 },
                    { bracket: 225000, rate: 0.055 },
                    { bracket: 300000, rate: 0.0575 }
                ]
            }
        ]
    },
    {
        name: "Massachusetts",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 4400,
                taxBrackets: [
                    { bracket: 0, rate: 0.05 },
                    { bracket: 1000000, rate: 0.09 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 8800,
                taxBrackets: [
                    { bracket: 0, rate: 0.05 },
                    { bracket: 1000000, rate: 0.09 }
                ]
            }
        ]
    },
    {
        name: "Michigan",
        dependentDeduction: 5000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 5000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0425 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 10000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0425 }
                ]
            }
        ]
    },
    {
        name: "Minnesota",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0535 },
                    { bracket: 28080, rate: 0.068 },
                    { bracket: 92230, rate: 0.0785 },
                    { bracket: 171220, rate: 0.0985 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0535 },
                    { bracket: 41050, rate: 0.068 },
                    { bracket: 163890, rate: 0.0785 },
                    { bracket: 284810, rate: 0.0985 }
                ]
            }
        ]
    },
    {
        name: "Mississippi",
        dependentDeduction: 1500,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2300,
                personalExemption: 6000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 5000, rate: 0.04 },
                    { bracket: 10000, rate: 0.05 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 4600,
                personalExemption: 12000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 5000, rate: 0.04 },
                    { bracket: 10000, rate: 0.05 }
                ]
            }
        ]
    },
    {
        name: "Missouri",
        dependentDeduction: 1200,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 2100,
                taxBrackets: [
                    { bracket: 0, rate: 0.015 },
                    { bracket: 1121, rate: 0.02 },
                    { bracket: 2242, rate: 0.025 },
                    { bracket: 3363, rate: 0.03 },
                    { bracket: 4484, rate: 0.035 },
                    { bracket: 5605, rate: 0.04 },
                    { bracket: 6726, rate: 0.045 },
                    { bracket: 7847, rate: 0.05 },
                    { bracket: 8968, rate: 0.054 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 4200,
                taxBrackets: [
                    { bracket: 0, rate: 0.015 },
                    { bracket: 1121, rate: 0.02 },
                    { bracket: 2242, rate: 0.025 },
                    { bracket: 3363, rate: 0.03 },
                    { bracket: 4484, rate: 0.035 },
                    { bracket: 5605, rate: 0.04 },
                    { bracket: 6726, rate: 0.045 },
                    { bracket: 7847, rate: 0.05 },
                    { bracket: 8968, rate: 0.054 }
                ]
            }
        ]
    },
    {
        name: "Montana",
        dependentDeduction: 2440,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 4980,
                personalExemption: 2440,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 3100, rate: 0.02 },
                    { bracket: 5500, rate: 0.03 },
                    { bracket: 8400, rate: 0.04 },
                    { bracket: 11300, rate: 0.05 },
                    { bracket: 14500, rate: 0.06 },
                    { bracket: 18700, rate: 0.0675 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 9960,
                personalExemption: 4880,
                taxBrackets: [
                    { bracket: 0, rate: 0.01 },
                    { bracket: 3100, rate: 0.02 },
                    { bracket: 5500, rate: 0.03 },
                    { bracket: 8400, rate: 0.04 },
                    { bracket: 11300, rate: 0.05 },
                    { bracket: 14500, rate: 0.06 },
                    { bracket: 18700, rate: 0.0675 }
                ]
            }
        ]
    },
    {
        name: "Nebraska",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 7350,
                personalExemption: 151,
                taxBrackets: [
                    { bracket: 0, rate: 0.0246 },
                    { bracket: 3440, rate: 0.0351 },
                    { bracket: 20590, rate: 0.0501 },
                    { bracket: 33180, rate: 0.0684 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 14700,
                personalExemption: 302,
                taxBrackets: [
                    { bracket: 0, rate: 0.0246 },
                    { bracket: 6860, rate: 0.0351 },
                    { bracket: 41170, rate: 0.0501 },
                    { bracket: 66360, rate: 0.0684 }
                ]
            }
        ]
    },
    {
        name: "Nevada",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "New Hampshire",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "New Jersey",
        dependentDeduction: 1500,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 1000,
                taxBrackets: [
                    { bracket: 0, rate: 0.014 },
                    { bracket: 20000, rate: 0.0175 },
                    { bracket: 35000, rate: 0.035 },
                    { bracket: 40000, rate: 0.0553 },
                    { bracket: 75000, rate: 0.0637 },
                    { bracket: 500000, rate: 0.0897 },
                    { bracket: 5000000, rate: 0.1075 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 2000,
                taxBrackets: [
                    { bracket: 0, rate: 0.014 },
                    { bracket: 20000, rate: 0.0175 },
                    { bracket: 50000, rate: 0.0245 },
                    { bracket: 70000, rate: 0.035 },
                    { bracket: 80000, rate: 0.0553 },
                    { bracket: 150000, rate: 0.0637 },
                    { bracket: 500000, rate: 0.0897 },
                    { bracket: 5000000, rate: 0.1075 }
                ]
            }
        ]
    },
    {
        name: "New Mexico",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 4000,
                taxBrackets: [
                    { bracket: 0, rate: 0.017 },
                    { bracket: 5500, rate: 0.032 },
                    { bracket: 11000, rate: 0.047 },
                    { bracket: 16000, rate: 0.049 },
                    { bracket: 210000, rate: 0.059 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 8000,
                taxBrackets: [
                    { bracket: 0, rate: 0.017 },
                    { bracket: 8000, rate: 0.032 },
                    { bracket: 16000, rate: 0.047 },
                    { bracket: 24000, rate: 0.049 },
                    { bracket: 315000, rate: 0.059 }
                ]
            }
        ]
    },
    {
        name: "New York",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 8000,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.04 },
                    { bracket: 8500, rate: 0.045 },
                    { bracket: 11700, rate: 0.0525 },
                    { bracket: 13900, rate: 0.059 },
                    { bracket: 80650, rate: 0.0645 },
                    { bracket: 215400, rate: 0.0685 },
                    { bracket: 1077550, rate: 0.0965 },
                    { bracket: 5000000, rate: 0.103 },
                    { bracket: 25000000, rate: 0.109 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 16050,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.04 },
                    { bracket: 17150, rate: 0.045 },
                    { bracket: 23600, rate: 0.0525 },
                    { bracket: 27900, rate: 0.059 },
                    { bracket: 161550, rate: 0.0645 },
                    { bracket: 323200, rate: 0.0685 },
                    { bracket: 2155350, rate: 0.0965 },
                    { bracket: 5000000, rate: 0.103 },
                    { bracket: 25000000, rate: 0.109 }
                ]
            }
        ]
    },
    {
        name: "North Carolina",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0475 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0475 }
                ]
            }
        ]
    },
    {
        name: "North Dakota",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0110 },
                    { bracket: 41775, rate: 0.0204 },
                    { bracket: 101050, rate: 0.0227 },
                    { bracket: 458350, rate: 0.0264 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0110 },
                    { bracket: 69725, rate: 0.0204 },
                    { bracket: 168725, rate: 0.0227 },
                    { bracket: 458350, rate: 0.0264 }
                ]
            }
        ]
    },
    {
        name: "Ohio",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 26050, rate: 0.02765 },
                    { bracket: 46100, rate: 0.03226 },
                    { bracket: 92150, rate: 0.03688 },
                    { bracket: 115300, rate: 0.0399 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 26050, rate: 0.02765 },
                    { bracket: 46100, rate: 0.03226 },
                    { bracket: 92150, rate: 0.03688 },
                    { bracket: 115300, rate: 0.0399 }
                ]
            }
        ]
    },
    {
        name: "Oklahoma",
        dependentDeduction: 1000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 6350,
                personalExemption: 1000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0025 },
                    { bracket: 1000, rate: 0.0075 },
                    { bracket: 2500, rate: 0.0175 },
                    { bracket: 3750, rate: 0.0275 },
                    { bracket: 4900, rate: 0.0375 },
                    { bracket: 7200, rate: 0.05 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 12700,
                personalExemption: 2000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0025 },
                    { bracket: 2000, rate: 0.0075 },
                    { bracket: 5000, rate: 0.0175 },
                    { bracket: 7500, rate: 0.0275 },
                    { bracket: 9800, rate: 0.0375 },
                    { bracket: 12200, rate: 0.05 }
                ]
            }
        ]
    },
    {
        name: "Oregon",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 2540,
                personalExemption: 239,
                taxBrackets: [
                    { bracket: 0, rate: 0.0475 },
                    { bracket: 4050, rate: 0.0675 },
                    { bracket: 10200, rate: 0.0875 },
                    { bracket: 25550, rate: 0.099 },
                    { bracket: 64000, rate: 0.1125 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 5080,
                personalExemption: 478,
                taxBrackets: [
                    { bracket: 0, rate: 0.0475 },
                    { bracket: 8100, rate: 0.0675 },
                    { bracket: 20400, rate: 0.0875 },
                    { bracket: 51100, rate: 0.099 },
                    { bracket: 128000, rate: 0.1125 }
                ]
            }
        ]
    },
    {
        name: "Pennsylvania",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0307 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0307 }
                ]
            }
        ]
    },
    {
        name: "Rhode Island",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 9050,
                personalExemption: 4150,
                taxBrackets: [
                    { bracket: 0, rate: 0.0375 },
                    { bracket: 68200, rate: 0.0475 },
                    { bracket: 155050, rate: 0.0599 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 18100,
                personalExemption: 8300,
                taxBrackets: [
                    { bracket: 0, rate: 0.0375 },
                    { bracket: 113400, rate: 0.0475 },
                    { bracket: 258100, rate: 0.0599 }
                ]
            }
        ]
    },
    {
        name: "South Carolina",
        dependentDeduction: 4260,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 4260,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 3200, rate: 0.03 },
                    { bracket: 6400, rate: 0.04 },
                    { bracket: 9600, rate: 0.05 },
                    { bracket: 12800, rate: 0.06 },
                    { bracket: 16000, rate: 0.07 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 8520,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 },
                    { bracket: 3200, rate: 0.03 },
                    { bracket: 6400, rate: 0.04 },
                    { bracket: 9600, rate: 0.05 },
                    { bracket: 12800, rate: 0.06 },
                    { bracket: 16000, rate: 0.07 }
                ]
            }
        ]
    },
    {
        name: "South Dakota",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "Tennessee",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "Texas",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "Utah",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0485 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0485 }
                ]
            }
        ]
    },
    {
        name: "Vermont",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 7150,
                personalExemption: 4500,
                taxBrackets: [
                    { bracket: 0, rate: 0.0335 },
                    { bracket: 42150, rate: 0.066 },
                    { bracket: 102200, rate: 0.076 },
                    { bracket: 213150, rate: 0.0875 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 14300,
                personalExemption: 9000,
                taxBrackets: [
                    { bracket: 0, rate: 0.0335 },
                    { bracket: 70450, rate: 0.066 },
                    { bracket: 170550, rate: 0.076 },
                    { bracket: 355350, rate: 0.0875 }
                ]
            }
        ]
    },
    {
        name: "Virginia",
        dependentDeduction: 930,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 4500,
                personalExemption: 930,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 3000, rate: 0.03 },
                    { bracket: 5000, rate: 0.05 },
                    { bracket: 17000, rate: 0.0575 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 9000,
                personalExemption: 1860,
                taxBrackets: [
                    { bracket: 0, rate: 0.02 },
                    { bracket: 3000, rate: 0.03 },
                    { bracket: 5000, rate: 0.05 },
                    { bracket: 17000, rate: 0.0575 }
                ]
            }
        ]
    },
    {
        name: "Washington",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    },
    {
        name: "West Virginia",
        dependentDeduction: 2000,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 2000,
                taxBrackets: [
                    { bracket: 0, rate: 0.03 },
                    { bracket: 10000, rate: 0.04 },
                    { bracket: 25000, rate: 0.045 },
                    { bracket: 40000, rate: 0.06 },
                    { bracket: 60000, rate: 0.065 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 4000,
                taxBrackets: [
                    { bracket: 0, rate: 0.03 },
                    { bracket: 10000, rate: 0.04 },
                    { bracket: 25000, rate: 0.045 },
                    { bracket: 40000, rate: 0.06 },
                    { bracket: 60000, rate: 0.065 }
                ]
            }
        ]
    },
    {
        name: "Wisconsin",
        dependentDeduction: 700,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 12950,
                personalExemption: 700,
                taxBrackets: [
                    { bracket: 0, rate: 0.0354 },
                    { bracket: 13810, rate: 0.0465 },
                    { bracket: 27630, rate: 0.0627 },
                    { bracket: 304170, rate: 0.0765 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 25900,
                personalExemption: 1400,
                taxBrackets: [
                    { bracket: 0, rate: 0.0354 },
                    { bracket: 18420, rate: 0.0465 },
                    { bracket: 36840, rate: 0.0627 },
                    { bracket: 405560, rate: 0.0765 }
                ]
            }
        ]
    },
    {
        name: "Wyoming",
        dependentDeduction: 0,
        filingType: [
            {
                type: FilingTypeName.Single,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            },
            {
                type: FilingTypeName.Married,
                standardDeduction: 0,
                personalExemption: 0,
                taxBrackets: [
                    { bracket: 0, rate: 0.0 }
                ]
            }
        ]
    }
];

/**
 * Helper function to get state data by name
 * @param stateName - The name of the state to retrieve
 * @returns State object or undefined if not found
 */
export function getStateByName(stateName: string): State | undefined {
    const state = STATE_TAX_DATA.find(state => state.name === stateName);
    
    if (state) {
        // Validate state data at runtime
        const validationResult = StateDataValidator.validateState(state);
        if (!validationResult.isValid) {
            ErrorHandler.handleValidationError(validationResult, { stateName });
        }
    }
    
    return state;
}

/**
 * Helper function to get all state names
 * @returns Array of all state names
 */
export function getAllStateNames(): string[] {
    return STATE_TAX_DATA.map(state => state.name);
}

/**
 * Helper function to validate state data completeness
 * @param state - State object to validate
 * @returns boolean indicating if state data is complete
 */
export function validateStateData(state: State): boolean {
    // Check basic state properties
    if (!state.name || typeof state.dependentDeduction !== 'number') {
        return false;
    }
    
    // Check that both filing types exist
    if (!state.filingType || state.filingType.length !== 2) {
        return false;
    }
    
    // Check each filing type
    for (const filingType of state.filingType) {
        if (!filingType.type || 
            typeof filingType.standardDeduction !== 'number' ||
            typeof filingType.personalExemption !== 'number' ||
            !filingType.taxBrackets ||
            filingType.taxBrackets.length === 0) {
            return false;
        }
        
        // Check each tax bracket
        for (const bracket of filingType.taxBrackets) {
            if (typeof bracket.bracket !== 'number' || 
                typeof bracket.rate !== 'number' ||
                bracket.rate < 0 || bracket.rate > 1) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Helper function to validate all state data
 * @returns boolean indicating if all state data is valid
 */
export function validateAllStateData(): boolean {
    if (STATE_TAX_DATA.length !== 50) {
        ErrorHandler.logError(
            'INCOMPLETE_STATE_DATA',
            `Expected 50 states, found ${STATE_TAX_DATA.length}`,
            ErrorSeverity.ERROR
        );
        return false;
    }
    
    let allValid = true;
    STATE_TAX_DATA.forEach((state, index) => {
        const validationResult = StateDataValidator.validateState(state);
        if (!validationResult.isValid) {
            allValid = false;
            ErrorHandler.handleValidationError(validationResult, { stateIndex: index, stateName: state.name });
        }
    });
    
    return allValid;
}