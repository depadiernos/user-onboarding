import React, { useState, useEffect } from "react"
import { withFormik, Form, Field } from "formik"
import * as yup from "yup"
import axios from "axios"

function Signup({ status, errors, touched, isSubmitting }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (status) setUsers((existingUsers) => [...existingUsers, status])
  }, [status])

  return (
    <>
      <Form>
        <Field type="text" name="name" placeholder="Name" />
        {touched.name && errors.name && <span>{errors.name}</span>}
        <Field type="email" name="email" placeholder="Email" />
        {touched.email && errors.email && <span>{errors.email}</span>}
        <Field type="password" name="password" placeholder="Password" />
        {touched.password && errors.password && <span>{errors.password}</span>}
        <label>
          <Field type="checkbox" name="tos" /> Accept the Terms of Service
        </label>
        {touched.tos && errors.tos && <span>{errors.tos}</span>}
        <button type="submit" disabled={isSubmitting}>
          Submit!
        </button>
      </Form>
      {users.map((user) => (
        <div key={user.id}>
          <h2>Name: {user.name}</h2>
          <h4>Email: {user.email}</h4>
          <p>Account created at {user.createdAt}</p>
        </div>
      ))}
    </>
  )
}

export default withFormik({
  mapPropsToValues({ name, password, email, tos }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false
    }
  },
  validationSchema: yup.object().shape({
    name: yup.string().required("Please provide your name"),
    email: yup
      .string()
      .email("Please provide a valid email address")
      .required("Please provide your email"),
    password: yup
      .string()
      .min(6, "Please set a password at least 6 characters long")
      .required("Please set a password at least 6 characters long"),
    tos: yup.bool().oneOf([true], "You must accept the Terms of Service")
  }),
  handleSubmit(values, { setStatus, resetForm, setErrors, setSubmitting }) {
    if (values.email === "waffle@syrup.com") {
      setErrors({ email: "That email is already taken" })
    } else {
      axios
        .post("https://reqres.in/api/users", values)
        .then((res) => {
          setStatus(res.data)
          resetForm()
          setSubmitting(false)
        })
        .catch((err) => {
          console.log(err)
          setSubmitting(false)
        })
    }
  }
})(Signup)
