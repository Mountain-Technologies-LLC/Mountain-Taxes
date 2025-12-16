# Mountain Taxes
A serverless lead management system built with .NET 8 Blazor WebAssembly and AWS cloud services.

## Deployment
Production: https://taxes.mountaintechnologiesllc.com

Single command deployment: `npm run deploy:full`

# Local Commands
* `npm run start`
- `npm run build`

# AWS Commands for https://taxes.mountaintechnologiesllc.com
- See [infrastructure README.md](./infrastructure/README.md) for more.
- `npm run synth`
- `npm run diff`
- `npm run deploy`
- Destroy from AWS
   - `npm run destroy -- --context name=taxes.mountaintechnologiesllc.com`


# Initial Prompt
I want to create a taxes website called Mountain Taxes. I want the website to be a Bootstrap v5.3 web app. I want the web app to be placed in the ./website folder. I want to only write TypeScript. JavaScript will not be allowed.

In the ./infrastructure folder, I have copied .NET cdk code to deploy a website to a s3 bucket, with distributions and routing. I will be deploying to http://taxes.mountaintechnologiesllc.com. I am using NPM to locally run builds. Please do implement fixes and optimizations to existing cdk code.

I want the Bootstrap v5.3 web app to be made to create a Taxes app. I will help people see how much taxes one will pay as their earned income increases. I want to use Bootswatch's Brite theme. I want data to be used form https://taxfoundation.org/data/all/state/state-income-tax-rates/. Data is also in .kiro/steering/2025-State-Individual-Income-Tax-Rates-and-Brackets-2025.xlsx.

Each state should have a data model like below:

export interface State {
  name: string;
  filingType: FilingType[];
  dependentDeduction: number;
}

export interface FilingType {
  type: FilingTypeName;
  standardDeduction: number;
  personalExemption: number;
  taxBrackets: TaxBracket[];
}

enum FilingTypeName {
  Single = "Single",
  Married = "Married"
}

export interface TaxBracket {
  bracket: number;
  rate: number;
}

I want the index page to use a chart.js line chart. I want the earned income to be on the X axis. I want taxes paid to be on the Y axis. I want the initial data on the X axis to start from zero and go to 100k in increments of 10k. Each state selected will be a dataset shown in the chart. Beneath the chart I want buttons to add data. The buttons will be: "Add 10k", "Add 100k", "Add 1m", "Add 10m", and "Remove data set". On another row, I want to show another list of buttons that includes: an "All states" as a button that if pressed will select each state and added to the line chart, a "Remove all" button that will uncheck all state buttons and remove them from the line chart, and each state as a button that if pressed will add the state to the chart. Each state will have a chart that will show the amount of taxes paid on earned income. I also want links to each state that shows the data model of how earned income is taxed. I want The state data to be populated from form https://taxfoundation.org/data/all/state/state-income-tax-rates/. Data is also in .kiro/steering/2025-State-Individual-Income-Tax-Rates-and-Brackets-2025.xlsx. I want it to be hardcoded so that it can be rendered quickly to the user when they are using this website. But I want the website to be dynamic enough to allow for the functionality above. As stated before, I only want the chart to only consider earned income.
