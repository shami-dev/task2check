import { Heading, Link as LinkRadix, Section, Text } from "@radix-ui/themes";
import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import styles from "~/styles/shared.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function Index() {
  return (
    <Section px={{ initial: "2", sm: "6" }}>
      <Heading
        as="h1"
        align="center"
        size="7"
        weight="bold"
        wrap="pretty"
        color="blue"
        mb="8"
      >
        About{" "}
        <Link to="/" className="link">
          Task2Check
        </Link>
      </Heading>
      <Heading as="h2" mb="4" size="6">
        Purpose
      </Heading>

      <Text as="p" mb="4">
        The main aim of this project is to provide users with an environment
        similar to a computer-based{" "}
        <LinkRadix href="https://ielts.org/">IELTS</LinkRadix> Writing Task 2
        exam. Also, to help them to become better essay writers.
      </Text>

      <Heading as="h2" mb="4" size="6">
        How to Use It
      </Heading>
      <Text as="p" mb="4">
        There are several ways to use the app.
      </Text>

      <Heading as="h3" mb="2" size="4">
        Method 1: Practice with Tasks
      </Heading>
      <Text as="p" mb="4">
        If you don&apos;t have specific tasks for IELTS Writing Task 2, start by
        finding some online. You can search the web or use one of my favorite
        resources:{" "}
        <LinkRadix href="https://ieltsliz.com/100-ielts-essay-questions">
          IELTS Liz - 100 IELTS Essay Questions
        </LinkRadix>
        . Alternatively, you can choose a topic and ask the AI to generate tasks
        for you.
      </Text>
      <Text as="p" mb="4">
        Once you have your task, paste or type it into the &quot;Insert your
        task here&quot; input field. Start your stopwatch and ensure you
        complete your essay within 40 minutes, the time allocated in the real
        exam. If you manage to write your essay within this time and maintain
        good quality, well done!
      </Text>
      <Text as="p" mb="4">
        After finishing, review your writing using tools like Google Docs or
        Grammarly. Remember to turn off all extensions during your writing
        process.
      </Text>
      <Text as="p" mb="4">
        To enhance your writing skills, this website provides a brief report on
        your essay and feedback, along with an approximate band score range.
        Please note, this score is not highly precise.
      </Text>
      <Text as="p" mb="4">
        You can practice the real exam interface here:
      </Text>
      <ul>
        <li>
          Academic:{" "}
          <LinkRadix href="https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/ielts-on-computer/practice-tests/writing-academic">
            British Council Practice Tests - Academic
          </LinkRadix>
        </li>
        <li>
          General Training:{" "}
          <LinkRadix href="https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/ielts-on-computer/practice-tests/writing-general-training">
            British Council Practice Tests - General Training
          </LinkRadix>
        </li>
      </ul>

      <Heading as="h3" mb="2" size="4">
        Method 2: Review Past Essays
      </Heading>
      <Text as="p" mb="4">
        As an IELTS student, you likely have a collection of essays from your
        previous attempts. You can paste these essays into the app to get
        AI-generated reports. This feature can help you identify and correct
        recurring mistakes.
      </Text>

      <Heading as="h2" mb="4" size="6">
        Author
      </Heading>
      <Text as="p" mb="4">
        My name is Shamil, and I&apos;m a web developer. When I&apos;m not
        helping small businesses, I build pet projects, including open-source
        ones. Seeing people use my projects is truly rewarding.
      </Text>
      <Text as="p" mb="4">
        I&apos;ve taken the IELTS exam twice, and I know it&apos;s not easy. The
        test not only develops your English communication skills but also your
        way of thinking. I found some of the topics quite insightful.
      </Text>
      <Text as="p" mb="4">
        I created this web app after being inspired by my second IELTS result -
        7.5 (C1 level). My first attempt was 6.5 (B2 level).
      </Text>
      <Text as="p" mb="4">
        If you have any questions, feedback, or just want to discuss something,
        feel free to connect with me on LinkedIn:{" "}
        <LinkRadix href="https://www.linkedin.com/in/shamil-khaibullov">
          Shamil Khaibullov
        </LinkRadix>
        .
      </Text>
    </Section>
  );
}
