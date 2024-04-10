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
import { Form, Link, useNavigation } from "@remix-run/react";
import styles from "~/styles/index.css?url";
import { useEffect, useRef } from "react";

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
  const formData = await request.formData();
  const task = String(formData.get("task"));
  const answer = String(formData.get("answer"));

  return { task, answer };
}

export default function Index() {
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);
  const isAdding = navigation.state === "submitting";

  useEffect(() => {
    if (!isAdding) formRef.current!.reset();
  }, [isAdding]);

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
                  <Label.Root htmlFor="task">Insert your task here:</Label.Root>
                  <TextArea
                    id="task"
                    name="task"
                    mt="2"
                    radius="none"
                    cols={50}
                    rows={6}
                    resize="vertical"
                    spellCheck="false"
                  />
                </Box>
                <Box maxWidth="700px">
                  <Label.Root htmlFor="answer">
                    Insert your response here:
                  </Label.Root>
                  <TextArea
                    id="answer"
                    name="answer"
                    mt="2"
                    radius="none"
                    cols={50}
                    rows={15}
                    resize="vertical"
                    spellCheck="false"
                  />
                  <Flex justify="end">
                    <Button mt="4" variant="solid">
                      Get AI report
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Form>
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
