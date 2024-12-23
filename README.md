<div align='center'>
  <img width='100%' src='https://blog.ledn.io/hs-fs/hubfs/Ledn_Animation_short-1.gif?width=1017&name=Ledn_Animation_short-1.gif'/>
  <br><br>
  <h3>Where digital assets come to life</h3>
  <br><br>
  <h1>Coruscant Banking System</h1>
</div>

## Demo

You can check a demo of Coruscant Bank running here: <a href="https://interstellar-bank.vercel.app/en" target="_blank">Coruscant Bank Demo</a>

_Obs: interstellar-bank was the previous name I picked for the project._

Feature demo video: https://youtu.be/-yf9cJfqLJs

Mobile responsiveness, theme changing (light/dark), internationalization demo: https://youtu.be/W603bedAXks

## Installation

1. Install dependencies: `npm install`
2. Run application: `npm start` and go to http://localhost:3000/
3. Run tests: `npm run test`

## Note

I've added 2 packages that weren't included in the initial setup:

- `@tabler/icons-react`, to be able to add icons to the project.
- `@mantine/charts`, to add an exchange chart

> Please, feel free to disconsider these additional libs when scoring this challenge (I added them because they are a complement from the `@mantine` libs already installed in the project)

I also made a really small change to `servers.ts`, I added an export to access the TS in the application:

```
export type { ExchangeRate, Planet, User, Transaction };
```

## Requirements

1. **Summary**

- The administrators would like to see a summary of all the planets of the galaxy. ✅
  > Navigate to `/en/planets` or click in the left-side navigation `Planets` button
- From those planets, they would like to be able to search for a planet by its name. ✅
  > Search field added and state is managed by the query params (so that when the user refreshes or shares the current URL, filtering continue to apply)

2. **Detail**

- The administrators would like to access detailed information of the planet. ✅
  > Click one of the planets in the table and it should take you to `/en/planets/id`
- They would like to filter the transactions by its currency type (GSC (Galactic Credit Standard) and ICS (Imperial Crown Standard)). ✅
  > Single select/dropdown for currency type
- They would like to see each transaction in each currency (GSC and ISC) according to a real-time exchange rate. ✅
  > Table contains the `Amount` column with the currency and amount of the original transaction and the `Conversion` column shows the conversion in realtime with the latest exchange rate
- They would like to see the total amount transacted (displayed in both GSC and in ISC). ✅
  > Total ICS and GCS transactioned at the top. (A simple sum was performed, so if there was an ICS transaction with "-1" and another with "1" the total would be "0")

### Technical requirements

To ensure the success of your mission, adopt the following technical specifications:

#### - **Technologies & languages:**

- Use `React Query` to execute all the requests to the endpoints. ✅
- Build the solution using `Typescript` and `React`. ✅
- In order to allow us to review a similar set of challenges, do not update, change or edit the mock server.
  > The mock server wasn't touched, but I added the type export to the file

#### - **User interface:**

- Organize the UI to the best of your knowledge and judgment as if this was a real application. ✅
  > Could have made some components and pages even more reusable, but I guess there is always space for improvement
- Ensure the UI is responsive, even in very small screens. ✅
- In order to allow us to review a similar set of challenges, only use libraries already present in the package.json.
  > I've added 2 packages that weren't included in the initial setup:
  >
  > - `@tabler/icons-react`, to be able to add icons to the project.
  > - `@mantine/charts`, to add an exchange chart
  >   Please, feel free to disconsider these additional libs when scoring this challenge (I added them because they are a complement from the `@mantine` libs already installed in the project)
- In order to allow us to review HTML and CSS knowledge, the component to filter the transactions by its currency type should be coded from scratch, without using the UI component libraries. ✅
  > The component can be found in the file: `src/components/SingleSelectFilter.tsx`

#### - **Flexible requirements**

You MUST choose 2 of the following requirements:

- Implement a solution capable of turning all transactions with a status of `inProgress` for a given planet to `blocked` using a planet ID. ✅
  > Can perform action in `/planets/id` or `/users/id` pages
- Add additional controls to filter the planets by terrain and climate. ✅
  > Added Climate, Terrain filters to `Planets` and `Status` to `planet/id` and `user/id`
- Create the UI from scratch without using any UI component libraries.
  > I used the provided ui lib.
- Add multiple languages to the application. ✅
  > Added support for multiple languages (already setup to handle English, Portuguese and Spanish)
- Add automated tests. ✅

  > I did add tests, but only to one component. Relevant files `src/tests-utils.tsx` and `src/components/TotalTransactions.test.tsx`

#### - **Testing and validation:**

- Provide screenshots or recording of the final implementation. ✅
  > Can be found in `/screenshots` folder
- Provide comprehensive guidelines for testing your data architecture. ✅
  > See [Installation](#installation) section
- Include step-by-step instructions for starting the solution. ✅
  > See [Installation](#installation) section
- Provide which flexible requirements you have chosen. ✅
  > See [Flexible requirements](#flexible-requirements) section
