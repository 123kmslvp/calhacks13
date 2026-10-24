// Sample roster standing in for what a teacher creates on the teacher side.
// The teacher enters each student's name and grade; the username and
// password are generated for them. Replace with a real backend later —
// passwords must never be stored or checked in the browser like this.
export const STUDENTS = [
  {
    username: 'maya.r',
    password: 'corn42',
    name: 'Maya',
    grade: 3,
    teacher: 'Ms. Lopez',
    avatar: '🦊',
    points: 120,
  },
  {
    username: 'leo.k',
    password: 'pop77',
    name: 'Leo',
    grade: 4,
    teacher: 'Mr. Chen',
    avatar: '🐼',
    points: 340,
  },
  {
    username: 'ava.t',
    password: 'kern9',
    name: 'Ava',
    grade: 5,
    teacher: 'Ms. Patel',
    avatar: '🦄',
    points: 560,
  },
]

export function findStudent(username, password) {
  const u = username.trim().toLowerCase()
  return STUDENTS.find((s) => s.username === u && s.password === password.trim()) ?? null
}
