import {expect, test} from 'vitest'
import { _symbol } from "../src/types"
import { evalString} from "../src/interpreter"

test('interpreter', () => {
  expect(evalString('(+ 1 1)')).toBe("2")
  expect(evalString('(let [x 1] x)')).toBe("1")
  expect(evalString('(let [y 3] y)')).toBe("3")
  expect(evalString('{:a 1}')).toBe("{:a 1}")
})