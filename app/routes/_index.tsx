/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Flex,
  Heading,
  Section,
  Strong,
  Text,
  TextArea,
  Link as LinkRadix,
  Container,
} from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import type {
  MetaFunction,
  LinksFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import styles from "~/styles/index.css?url";
import { useEffect, useRef } from "react";
import OpenAI from "openai";
import { typedjson } from "remix-typedjson";
import ReactMarkdown from "react-markdown";

export const meta: MetaFunction = () => {
  return [
    { title: "Task 2 Check" },
    {
      name: "description",
      content: "Welcome to the IELTS AI Writing Part-2 Checker!",
    },
  ];
};

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export async function action({ request }: ActionFunctionArgs) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const formData = await request.formData();
    const task = String(formData.get("task"));
    const answer = String(formData.get("answer"));

    const validationErrors: {
      taskFieldError?: string;
      answerFieldError?: string;
      formError?: string;
    } = {};

    if (typeof task !== "string" || typeof answer !== "string") {
      validationErrors.formError =
        "Form not submitted correctly. Please check your inputs.";
    }

    if (!task || task.length === 0) {
      validationErrors.taskFieldError =
        "The task field cannot be empty. Please, write or paste your task.";
    }

    if (!answer || answer.length === 0) {
      validationErrors.answerFieldError =
        "The answer field cannot be empty. Please write or paste your essay.";
    }

    if (Object.keys(validationErrors).some(Boolean)) {
      return typedjson({ validationErrors }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Imagine you're an adept IELTS coach with a keen eye for detail and a passion for helping students excel in their writing. Your task is to provide comprehensive feedback on an IELTS General Writing Part 2 task and the accompanying essay. Your feedback should encompass: - Identification and Correction: Thoroughly identify and correct all grammatical errors, including spelling mistakes, punctuation errors, and syntactical issues. - Appropriate Word Usage: Evaluate the appropriateness and accuracy of word choice throughout the essay, ensuring precision and clarity in language. - Suggestions for Improvement: Offer constructive suggestions to enhance the overall quality of the essay, including ways to strengthen arguments, improve coherence and cohesion, and expand vocabulary. - Utilize markdown formatting to structure your feedback for clarity and readability. - Your feedback should be concise, staying within a 600-word limit, while providing detailed insights into areas of improvement. Additionally, provide an approximate band score range for the essay based on your evaluation. - Approximate Band Score Range: [Based on the feedback provided, estimate the band score range for the essay.]",
        },
        {
          role: "user",
          content: `Task: ${task}, Response: ${answer}`,
        },
      ],
      temperature: 0.8,
      top_p: 0.8,
    });

    const result = completion.choices[0].message.content;

    return typedjson({ task, answer, result });
  } catch (error) {
    return { error: "Something went wrong! Please try again." };
  }
}

export default function Index() {
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const isAdding = navigation.state === "submitting";

  useEffect(() => {
    if (!isAdding) formRef.current!.reset();
  }, [isAdding]);

  const data = useActionData<typeof action>();

  return (
    <>
      <main>
        <Section px="4">
          <Heading
            as="h1"
            align="center"
            size="7"
            weight="bold"
            wrap="pretty"
            color="blue"
            mb="8"
          >
            Welcome to the IELTS Writing Part-2 AI Checker!
          </Heading>
          <Container maxWidth="1024px">
            <Form ref={formRef} method="post">
              <Flex
                justify="between"
                direction={{ initial: "column", sm: "row" }}
                gap="6"
              >
                <Box maxWidth="700px">
                  <Text as="p" mb="4">
                    <Strong>
                      You should spend about 40 minutes on this task Write at
                      least 250 words
                    </Strong>
                  </Text>
                  <Label.Root htmlFor="task">
                    Insert your task here: *{" "}
                  </Label.Root>
                  {data?.validationErrors?.taskFieldError ? (
                    <em>
                      <Text color="red" as="p">
                        {data?.validationErrors?.taskFieldError}
                      </Text>
                    </em>
                  ) : null}
                  <TextArea
                    id="task"
                    name="task"
                    mt="2"
                    radius="none"
                    cols={50}
                    rows={6}
                    resize="vertical"
                    spellCheck="false"
                    required
                  />
                </Box>
                <Box maxWidth="700px">
                  <Label.Root htmlFor="answer">
                    Insert your response here: *
                  </Label.Root>
                  {data?.validationErrors?.answerFieldError ? (
                    <em>
                      <Text color="red" as="p">
                        {data?.validationErrors?.answerFieldError}
                      </Text>
                    </em>
                  ) : null}
                  <TextArea
                    id="answer"
                    name="answer"
                    mt="2"
                    radius="none"
                    cols={50}
                    rows={15}
                    resize="vertical"
                    spellCheck="false"
                    required
                  />
                  {data?.validationErrors?.formError ? (
                    <em>
                      <Text color="red" as="p">
                        {data?.validationErrors?.formError}
                      </Text>
                    </em>
                  ) : null}
                  <Flex justify="end">
                    <Button loading={isAdding} mt="4" variant="solid">
                      Get AI report
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Form>
            {data?.result && (
              <Flex direction={{ initial: "column", sm: "row" }} mt="8" gap="4">
                <Box
                  className="response-box"
                  width={{ initial: "100%", sm: "60%" }}
                  p="4"
                >
                  <Text as="p">
                    {/* Coherence and cohesion: The essay is generally well-structured
                  with an introduction, body paragraphs discussing each
                  viewpoint, and a clear opinion stated in the conclusion. The
                  writer uses transition words like "however," "otherwise," and
                  "as a consequence" to link ideas within and between sentences.
                  However, there are some issues with clarity in some sentences,
                  such as "It can be less risk-taking in comparison with private
                  support," which could be rephrased for better coherence.
                  Overall, the essay demonstrates a good level of coherence and
                  cohesion but could benefit from further clarity. Lexical
                  resource: The writer demonstrates a wide range of vocabulary
                  by using varied terms such as "prosperity," "bureaucracy,"
                  "self-development," and "imbalance." Some less common and more
                  sophisticated vocabulary choices, such as "monetary backing"
                  instead of "financial support," could enhance the essay's
                  lexical resource further. However, there are instances of
                  awkward or unclear phrasing, such as "I tend to thing that the
                  combined funding are more valuable," which affects the overall
                  lexical resource score. Grammatical range and accuracy: The
                  writer shows a good range of grammatical structures, including
                  complex sentences and conditional clauses. Some errors in
                  subject-verb agreement ("the creative crowd will have many
                  more choices") and word choice ("thing" instead of "think")
                  are present. Additionally, there are a few instances of
                  awkward phrasing that affect clarity, such as "When companies'
                  offer a great support, authorities can delegate this duty."
                  Overall, the essay demonstrates a good command of grammar but
                  would benefit from more accuracy and precision in expression.
                  Overall, this essay demonstrates a sufficient level of English
                  proficiency for IELTS Writing Task 2, particularly in
                  coherence and cohesion and lexical resource. However,
                  improvements in grammatical accuracy and clarity of expression
                  could elevate the essay to a higher band score. This essay
                  would likely score around Band 6. */}
                    <ReactMarkdown>{data.result}</ReactMarkdown>
                  </Text>
                </Box>
                <Box
                  className="task-box"
                  width={{ initial: "100%", sm: "40%" }}
                  p="4"
                >
                  <Flex direction="column">
                    <Box>
                      <Text as="p">
                        {/* Task: Some people believe that the government should
                      provide financial assistance to musicians, artists, and
                      other creative individuals to encourage cultural growth.
                      Others argue that this support should come from other
                      sources, such as private or corporate funding. Discuss
                      both views and give your opinion. */}
                        <b>Task</b>
                        {`: ${data.task}`}
                      </Text>
                    </Box>
                    <Box>
                      <Text as="p">
                        {/* Response: There are no doubts that the amount of support
                      given to a cultural sector is correlated with the cultural
                      prosperity of a society as well as the sources of its
                      support. Some people say that the talented people should
                      be supported by government, and others consider that
                      fundings should be received from companies and
                      corporations. In my opinion, if the creative people has
                      financial support from both places, they have more options
                      to choose from. */}
                        <b>Response</b>
                        {`: ${data.answer}`}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )}
          </Container>
        </Section>
      </main>
      <Section mx="4">
        <footer>
          <Container size="2">
            <Flex justify="center" align="center" gap="8">
              <Link to="/about" className="link">
                About the project
              </Link>
              <p>
                <LinkRadix href="mailto:shamil@shami.dev">
                  Send feedback
                </LinkRadix>
              </p>
            </Flex>
            <Text as="p" align="center">
              Copyright © {new Date().getFullYear()} Shamil
            </Text>
          </Container>
        </footer>
      </Section>
    </>
  );
}
