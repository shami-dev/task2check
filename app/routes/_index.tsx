import type {
  MetaFunction,
  LinksFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import styles from "~/styles/index.css?url";

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
  return (
    <>
      <main>
        <section>
          <h1>Welcome to the IELTS Writing Part-2 AI Checker!</h1>
          <Form method="post">
            <div className="form-box">
              <div>
                <p>
                  <strong>
                    You should spend about 40 minutes on this task Write at
                    least 250 words
                  </strong>
                </p>
                <label htmlFor="task">Insert your task here:</label>
                <textarea name="task" id="tasks" cols={50} rows={6}></textarea>
              </div>
              <div>
                <textarea name="answer" cols={50} rows={15}></textarea>
              </div>
            </div>
            <button type="submit">Get AI report</button>
          </Form>
        </section>
      </main>
      <footer>
        <Link to={"/about"}>About the project</Link>
        <p>
          <a href="mailto:shamil@shami.dev">Send feedback</a>
        </p>
        <p>
          Copyright (c) {new Date().getFullYear()}{" "}
          <a href="https://www.shami.dev/">Shamil</a>
        </p>
      </footer>
    </>
  );
}
