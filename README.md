# Jersey Number Availability Checker

This application allows users to check the availability of jersey numbers and claim them if they're available.

## Features

- Check availability of jersey numbers
- Generate random available numbers
- Claim available jersey numbers through a Google Form

## Technologies Used

- Next.js
- React
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/jersey-number-checker.git
   ```

2. Navigate to the project directory:
   ```
   cd jersey-number-checker
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/your-form-id/viewform
   ```

5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter a jersey number in the input field.
2. Click "Check" to see if the number is available.
3. If the number is available, you'll be presented with a link to claim it via a Google Form.
4. Alternatively, click "Generate for Me" to get a random available number.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Social Media

Follow us on:
- [YouTube](https://www.youtube.com/@mspbasketball)
- [Instagram](https://www.instagram.com/msp.basketball)

## Developer

This app was developed by [kris.mp](https://www.instagram.com/kris.mp).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.