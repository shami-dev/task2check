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
import sharedStyles from "~/styles/shared.css?url";
import indexStyles from "~/styles/index.css?url";
import { useEffect, useState } from "react";
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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: indexStyles },
  { rel: "stylesheet", href: sharedStyles },
];

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
        "The response field cannot be empty. Please write or paste your essay.";
    }

    if (Object.keys(validationErrors).some(Boolean)) {
      return typedjson({ validationErrors }, { status: 400 });
    }

    const band9EssayExample = `Social networking sites, for instance Facebook, are thought by some to have had a detrimental effect on individual people as well as society and local communities. However, while I believe that such sites are mainly beneficial to the individual, I agree that they have had a damaging effect on local communities.

    With regards to individuals, the impact that online social media has had on each individual person has clear advantages. Firstly, people from different countries are brought together through such sites as Facebook whereas before the development of technology and social networking sites, people rarely had the chance to meet or communicate with anyone outside of their immediate circle or community. Secondly, Facebook also has social groups which offer individuals a chance to meet and participate in discussions with people who share common interests.

    On the other hand, the effect that Facebook and other social networking sites have had on societies and local communities can only be seen as negative. Rather than individual people taking part in their local community, they are instead choosing to take more interest in people online. Consequently, the people within local communities are no longer forming close or supportive relationships. Furthermore, society as a whole is becoming increasingly disjointed and fragmented as people spend more time online with people they have never met face to face and who they are unlikely to ever meet in the future.

    To conclude, although social networking sites have brought individuals closer together, they have not had the same effect on society or local communities. Local communities should do more to try and involve local people in local activities in order to promote the future of community life.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an IELTS examiner. Provide practical feedback and band scores for the following IELTS Writing Task 2 essay.
          Essay Task: ${task}
          Band 9 Essay Example: ${band9EssayExample}
          Essay: ${answer}
          Feedback Instructions:
          1. Task Response (Band 1-9):
          - Evaluate how well the candidate addresses all parts of the task.
          - Consider whether the candidate's position is clear and well-supported with relevant examples.
          - Provide specific examples from the essay to justify the score.
          2. Coherence and Cohesion (Band 1-9):
          - Assess the logical organization of ideas and how well paragraphs and sentences are connected.
          - Look at the use of cohesive devices and transitions.
          - Point out any areas where the essay could be better organized or more cohesive.
          3. Lexical Resource (Band 1-9):
          - Evaluate the range of vocabulary used and the accuracy of word choice.
          - Note any instances of inappropriate or repetitive vocabulary.
          - Suggest synonyms or more precise word choices where necessary.
          4. Grammatical Range and Accuracy (Band 1-9):
          - Assess the range and accuracy of grammatical structures used.
          - Identify specific grammatical errors and suggest corrections.
          - Highlight any particularly complex or well-used structures.
          Band Score Calculation:
          - Provide a band score for each criterion (Task Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy).
          - Calculate an overall band score by averaging the four individual scores.

          Please provide detailed and concrete feedback based on the above instructions.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1500,
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
  const isAdding = navigation.state === "submitting";

  useEffect(() => {
    if (!isAdding) setText("");
  }, [isAdding]);

  const data = useActionData<typeof action>();

  // const data = {
  //   result:
  //     "Coherence and cohesion: The essay is generally well-structured with an introduction, body paragraphs discussing each viewpoint, and a clear opinion stated in the conclusion. The writer uses transition words like 'however,' 'otherwise,' and 'as a consequence' to link ideas within and between sentences. However, there are some issues with clarity in some sentences, such as 'It can be less risk-taking in comparison with private support,' which could be rephrased for better coherence. Overall, the essay demonstrates a good level of coherence and cohesion but could benefit from further clarity. Lexical resource: The writer demonstrates a wide range of vocabulary by using varied terms such as 'prosperity,' 'bureaucracy,' 'self-development,' and 'imbalance.' Some less common and more sophisticated vocabulary choices, such as 'monetary backing' instead of 'financial support,' could enhance the essay's lexical resource further. However, there are instances of awkward or unclear phrasing, such as 'I tend to thing that the combined funding are more valuable,' which affects the overall lexical resource score. Grammatical range and accuracy: The writer shows a good range of grammatical structures, including complex sentences and conditional clauses. Some errors in subject-verb agreement ('the creative crowd will have many more choices') and word choice ('thing' instead of 'think') are present. Additionally, there are a few instances of awkward phrasing that affect clarity, such as 'When companies' offer a great support, authorities can delegate this duty.' Overall, the essay demonstrates a good command of grammar but would benefit from more accuracy and precision in expression. Overall, this essay demonstrates a sufficient level of English proficiency for IELTS Writing Task 2, particularly in coherence and cohesion and lexical resource. However, improvements in grammatical accuracy and clarity of expression could elevate the essay to a higher band score. This essay would likely score around Band 6.",
  //   task: "Some people believe that the government should provide financial assistance to musicians, artists, and other creative individuals to encourage cultural growth. Others argue that this support should come from other sources, such as private or corporate funding. Discuss both views and give your opinion.",
  //   answer:
  //     "There are no doubts that the amount of support given to a cultural sector is correlated with the cultural prosperity of a society as well as the sources of its support. Some people say that the talented people should be supported by government, and others consider that fundings should be received from companies and corporations. In my opinion, if the creative people has financial support from both places, they have more options to choose from.",
  //   validationErrors: {
  //     taskFieldError: undefined,
  //     answerFieldError: undefined,
  //     formError: undefined,
  //   },
  // };

  const [text, setText] = useState("");

  function countWords() {
    const wordCount = text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;
    return wordCount;
  }

  return (
    <>
      <main>
        <Section px="4">
          <Link to="/" className="link">
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
          </Link>
          {data?.result?.length > 0 ? (
            ""
          ) : (
            <Form method="post">
              <Flex
                justify="between"
                direction={{ initial: "column", sm: "row" }}
                gap="6"
              >
                <Box maxWidth="700px">
                  <Text as="p" mb="4">
                    <Strong>
                      You should spend about 40 minutes on this task. Write at
                      least 250 words.
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
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Text>Word count: {countWords()}</Text>
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
          )}

          {data?.result && (
            <Flex direction={{ initial: "column", sm: "row" }} mt="8" gap="4">
              <Box
                className="response-box"
                width={{ initial: "100%", sm: "60%" }}
                px="4"
              >
                <ReactMarkdown>{data.result}</ReactMarkdown>
              </Box>
              <Box
                className="task-box"
                width={{ initial: "100%", sm: "40%" }}
                p="4"
              >
                <Flex direction="column">
                  <Box>
                    <Text as="p">
                      <b>Task</b>
                      {`: ${data.task}`}
                    </Text>
                  </Box>
                  <Box>
                    <Text as="p">
                      <b>Response</b>
                      {`: ${data.answer}`}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          )}
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
