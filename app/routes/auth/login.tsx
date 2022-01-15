import {
  Form,
  ActionFunction,
  useActionData,
  LoaderFunction,
  redirect,
  useLoaderData,
  Link,
} from "remix";
import { createUserSession, getUser, login } from "~/utils/session.server";

export let action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { formError: `Form not submitted correctly` };
  }

  let user = await login({ email, password });
  if (!user) {
    return {
      formError: `Username/Password combination is incorrect`,
    };
  }

  return createUserSession(user.id, "/");
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect("/");
  }

  return {};
};

export default function LoginRoute() {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/images/logo.png"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-light text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form className="space-y-6" action="#" method="post">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-light focus:border-primary-light sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary-light border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-primary-light"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light mb-2"
                >
                  Sign in
                </button>
                <Link to="/auth/register" className="text-primary text-center">
                  Register for Account
                </Link>
              </div>
              <div className="text-red-600">
                {actionData?.formError ? (
                  <p className="form-validation-error" role="alert">
                    {actionData?.formError}
                  </p>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
