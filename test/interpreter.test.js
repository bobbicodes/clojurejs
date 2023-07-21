import {expect, test} from 'vitest'
import { read_str } from "../src/reader"
import { _symbol } from "../src/types"
import {Env} from '../src/env.js'
import { evalString} from "../src/interpreter"

test('interpreter', () => {
  //expect(evalString(read_str('(let [x 2] x)'))).toBe(2)
  //expect(EVAL(read_str('(let [x 1] x)')), env1).toBe(1)
  //expect(_EVAL(read_str('(let [y 3] y)')), env1).toBe(3)
  //expect(_EVAL(read_str('{:a 1}')), env1).toBe(_symbol({a: 1}))
})