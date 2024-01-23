import React, { useState, ChangeEvent, FormEvent } from 'react';
import {trpc} from "@/src/app/_trpc/client";

function LoginForm() {
  // add trpc mutation
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { mutate } = trpc.login.useMutation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log(`Email: ${email}, Password: ${password}`);
    mutate({email, password});
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default LoginForm;
