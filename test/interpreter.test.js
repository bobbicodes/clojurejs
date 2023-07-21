import {expect, test} from 'vitest'
import { _symbol } from "../src/types"
import { evalString} from "../src/interpreter"
import {read_str} from "../src/reader"

test('evaluating defn, def, let', () => {
  expect(evalString('(+ 1 1)')).toBe("2")
  expect(read_str(evalString('(do (defn hi [s] (str "hi " s)) (hi "there"))'))).toBe(`hi there`)
  expect(evalString('(let [x 1] x)')).toBe("1")
  expect(evalString('(def y 1)')).toBe("1")
  expect(evalString('(let [y 3] y)')).toBe("3")
  expect(evalString('y')).toBe("1")
  expect(evalString('{:a 1}')).toBe("{:a 1}")
})