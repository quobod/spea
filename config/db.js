import chalk from "chalk";

const connectDB = async (mongoose) => {
  console.log(`\n\tConnecting to ${process.env.DB_URI}`);
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // useCreateIndex: true,
    });
    console.log(chalk.rgb(185, 220, 250).bold(`\tConnected DB`));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
