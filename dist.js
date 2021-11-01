(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/@n1ru4l/json-patch-plus/index.js
  var require_json_patch_plus = __commonJS({
    "node_modules/@n1ru4l/json-patch-plus/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function defaultMatch2(array1, array2, index1, index2) {
        return array1[index1] === array2[index2];
      }
      function lengthMatrix2(array1, array2, match, context) {
        const len1 = array1.length;
        const len2 = array2.length;
        let matrix = Object.assign([len1 + 1], {
          match
        });
        for (let x = 0; x < len1 + 1; x++) {
          matrix[x] = [len2 + 1];
          for (let y = 0; y < len2 + 1; y++) {
            matrix[x][y] = 0;
          }
        }
        for (let x = 1; x < len1 + 1; x++) {
          for (let y = 1; y < len2 + 1; y++) {
            if (match(array1, array2, x - 1, y - 1, context)) {
              matrix[x][y] = matrix[x - 1][y - 1] + 1;
            } else {
              matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
            }
          }
        }
        return matrix;
      }
      function backtrack2(matrix, array1, array2, context) {
        let index1 = array1.length;
        let index2 = array2.length;
        const subsequence = {
          sequence: [],
          indices1: [],
          indices2: []
        };
        while (index1 !== 0 && index2 !== 0) {
          const sameLetter = matrix.match(array1, array2, index1 - 1, index2 - 1, context);
          if (sameLetter) {
            subsequence.sequence.unshift(array1[index1 - 1]);
            subsequence.indices1.unshift(index1 - 1);
            subsequence.indices2.unshift(index2 - 1);
            --index1;
            --index2;
          } else {
            const valueAtMatrixAbove = matrix[index1][index2 - 1];
            const valueAtMatrixLeft = matrix[index1 - 1][index2];
            if (valueAtMatrixAbove > valueAtMatrixLeft) {
              --index2;
            } else {
              --index1;
            }
          }
        }
        return subsequence;
      }
      function get2(array1, array2, match, context) {
        const innerContext = context || {};
        const matrix = lengthMatrix2(array1, array2, match || defaultMatch2, innerContext);
        return backtrack2(matrix, array1, array2, innerContext);
      }
      function diff2(input, options) {
        var _a;
        const includePreviousValue = (_a = options === null || options === void 0 ? void 0 : options.includePreviousValue) !== null && _a !== void 0 ? _a : false;
        const objectHash = options === null || options === void 0 ? void 0 : options.objectHash;
        const matchByPosition = options === null || options === void 0 ? void 0 : options.matchByPosition;
        const context = {
          result: void 0,
          left: input.left,
          right: input.right,
          includePreviousValue,
          objectHash,
          matchByPosition,
          stopped: false
        };
        function process(context2) {
          var _a2, _b;
          const steps = [
            nested_collectChildrenDiffFilter2,
            trivialDiffFilter2,
            nested_objectsDiffFilter2,
            array_diffFilter2
          ];
          for (const step of steps) {
            step(context2);
            if (context2.stopped) {
              context2.stopped = false;
              break;
            }
          }
          if ((_a2 = context2.children) === null || _a2 === void 0 ? void 0 : _a2.length) {
            for (const childrenContext of context2.children) {
              process(childrenContext);
              if (childrenContext.result !== void 0) {
                context2.result = (_b = context2.result) !== null && _b !== void 0 ? _b : {};
                context2.result[childrenContext.name] = childrenContext.result;
              }
            }
            if (context2.result && context2.leftIsArray) {
              context2.result._t = "a";
            }
          }
        }
        process(context);
        return context.result;
      }
      function trivialDiffFilter2(context) {
        if (context.left === context.right) {
          context.result = void 0;
          context.stopped = true;
          return;
        }
        if (typeof context.left === "undefined") {
          context.result = [context.right];
          context.stopped = true;
          return;
        }
        if (typeof context.right === "undefined") {
          const previousValue = context.includePreviousValue ? context.left : null;
          context.result = [previousValue, 0, 0];
          context.stopped = true;
          return;
        }
        context.leftType = context.left === null ? "null" : typeof context.left;
        context.rightType = context.right === null ? "null" : typeof context.right;
        if (context.leftType !== context.rightType) {
          const previousValue = context.includePreviousValue ? context.left : null;
          context.result = [previousValue, context.right];
          context.stopped = true;
          return;
        }
        if (context.leftType === "boolean" || context.leftType === "number" || context.leftType === "string") {
          const previousValue = context.includePreviousValue ? context.left : null;
          context.result = [previousValue, context.right];
          context.stopped = true;
          return;
        }
        if (context.leftType === "object") {
          context.leftIsArray = Array.isArray(context.left);
        }
        if (context.rightType === "object") {
          context.rightIsArray = Array.isArray(context.right);
        }
        if (context.leftIsArray !== context.rightIsArray) {
          const previousValue = context.includePreviousValue ? context.left : null;
          context.result = [previousValue, context.right];
          context.stopped = true;
          return;
        }
      }
      function nested_collectChildrenDiffFilter2(context) {
        if (!context || !context.children) {
          return;
        }
        const length = context.children.length;
        let child;
        let result = context.result;
        for (let index = 0; index < length; index++) {
          child = context.children[index];
          if (typeof child.result === "undefined") {
            continue;
          }
          result = result !== null && result !== void 0 ? result : {};
          result[child.name] = child.result;
        }
        if (result && context.leftIsArray) {
          result["_t"] = "a";
        }
        context.result = result;
        context.stopped = true;
      }
      function nested_objectsDiffFilter2(context) {
        if (context.leftIsArray || context.leftType !== "object") {
          return;
        }
        const left = context.left;
        const right = context.right;
        for (const name in left) {
          if (!Object.prototype.hasOwnProperty.call(left, name)) {
            continue;
          }
          if (context.children === void 0) {
            context.children = [];
          }
          context.children.push({
            left: left[name],
            right: right[name],
            result: void 0,
            name,
            includePreviousValue: context.includePreviousValue,
            objectHash: context.objectHash,
            matchByPosition: context.matchByPosition,
            stopped: false
          });
        }
        for (const name in right) {
          if (!Object.prototype.hasOwnProperty.call(right, name)) {
            continue;
          }
          if (typeof left[name] === "undefined") {
            if (context.children === void 0) {
              context.children = [];
            }
            context.children.push({
              left: void 0,
              right: right[name],
              result: void 0,
              name,
              includePreviousValue: context.includePreviousValue,
              objectHash: context.objectHash,
              matchByPosition: context.matchByPosition,
              stopped: false
            });
          }
        }
        if (!context.children || context.children.length === 0) {
          context.result = void 0;
          context.stopped = true;
          return;
        }
        context.stopped = true;
      }
      var ARRAY_MOVE2 = 3;
      function array_diffFilter2(context) {
        if (!context.leftIsArray) {
          return;
        }
        let matchContext = {
          objectHash: context.objectHash,
          matchByPosition: context.matchByPosition
        };
        let commonHead = 0;
        let commonTail = 0;
        let index;
        let index1;
        let index2;
        const array1 = context.left;
        const array2 = context.right;
        const len1 = array1.length;
        const len2 = array2.length;
        if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== "boolean") {
          matchContext.matchByPosition = !arraysHaveMatchByRef2(array1, array2, len1, len2);
        }
        while (commonHead < len1 && commonHead < len2 && matchItems2(array1, array2, commonHead, commonHead, matchContext)) {
          index = commonHead;
          const left = context.left;
          const right = context.right;
          if (context.children === void 0) {
            context.children = [];
          }
          context.children.push({
            left: left[index],
            right: right[index],
            result: void 0,
            name: index,
            includePreviousValue: context.includePreviousValue,
            objectHash: context.objectHash,
            matchByPosition: context.matchByPosition,
            stopped: false
          });
          commonHead++;
        }
        while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems2(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
          index1 = len1 - 1 - commonTail;
          index2 = len2 - 1 - commonTail;
          const left = context.left;
          const right = context.right;
          if (context.children === void 0) {
            context.children = [];
          }
          context.children.push({
            left: left[index1],
            right: right[index2],
            result: void 0,
            name: index2,
            includePreviousValue: context.includePreviousValue,
            objectHash: context.objectHash,
            matchByPosition: context.matchByPosition,
            stopped: false
          });
          commonTail++;
        }
        if (commonHead + commonTail === len1) {
          if (len1 === len2) {
            context.result = void 0;
            context.stopped = true;
            return;
          }
          const result2 = {
            _t: "a"
          };
          for (index = commonHead; index < len2 - commonTail; index++) {
            result2[index] = [array2[index]];
          }
          context.result = result2;
          context.stopped = true;
          return;
        }
        if (commonHead + commonTail === len2) {
          const result2 = {
            _t: "a"
          };
          for (index = commonHead; index < len1 - commonTail; index++) {
            result2[`_${index}`] = [
              context.includePreviousValue ? array1[index] : null,
              0,
              0
            ];
          }
          context.result = result2;
          context.stopped = true;
          return;
        }
        delete matchContext.hashCache1;
        delete matchContext.hashCache2;
        let trimmed1 = array1.slice(commonHead, len1 - commonTail);
        let trimmed2 = array2.slice(commonHead, len2 - commonTail);
        let seq = get2(trimmed1, trimmed2, matchItems2, matchContext);
        let removedItems = [];
        const result = {
          _t: "a"
        };
        for (index = commonHead; index < len1 - commonTail; index++) {
          if (seq.indices1.indexOf(index - commonHead) < 0) {
            result[`_${index}`] = [
              context.includePreviousValue ? array1[index] : null,
              0,
              0
            ];
            removedItems.push(index);
          }
        }
        let removedItemsLength = removedItems.length;
        for (index = commonHead; index < len2 - commonTail; index++) {
          let indexOnArray2 = seq.indices2.indexOf(index - commonHead);
          if (indexOnArray2 < 0) {
            let isMove = false;
            if (removedItemsLength > 0) {
              for (let removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
                index1 = removedItems[removeItemIndex1];
                if (matchItems2(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
                  result[`_${index1}`].splice(1, 2, index, ARRAY_MOVE2);
                  index2 = index;
                  if (context.children === void 0) {
                    context.children = [];
                  }
                  const left = context.left;
                  const right = context.right;
                  context.children.push({
                    left: left[index1],
                    right: right[index2],
                    result: void 0,
                    name: index2,
                    includePreviousValue: context.includePreviousValue,
                    objectHash: context.objectHash,
                    matchByPosition: context.matchByPosition,
                    stopped: false
                  });
                  removedItems.splice(removeItemIndex1, 1);
                  isMove = true;
                  break;
                }
              }
            }
            if (!isMove) {
              result[index] = [array2[index]];
            }
          } else {
            index1 = seq.indices1[indexOnArray2] + commonHead;
            index2 = seq.indices2[indexOnArray2] + commonHead;
            if (context.children === void 0) {
              context.children = [];
            }
            const left = context.left;
            const right = context.right;
            context.children.push({
              left: left[index1],
              right: right[index2],
              result: void 0,
              name: index2,
              includePreviousValue: context.includePreviousValue,
              objectHash: context.objectHash,
              matchByPosition: context.matchByPosition,
              stopped: false
            });
          }
        }
        context.result = result;
        context.stopped = true;
      }
      function arraysHaveMatchByRef2(array1, array2, len1, len2) {
        for (let index1 = 0; index1 < len1; index1++) {
          let val1 = array1[index1];
          for (let index2 = 0; index2 < len2; index2++) {
            let val2 = array2[index2];
            if (index1 !== index2 && val1 === val2) {
              return true;
            }
          }
        }
        return false;
      }
      function matchItems2(array1, array2, index1, index2, context) {
        let value1 = array1[index1];
        let value2 = array2[index2];
        if (value1 === value2) {
          return true;
        }
        if (typeof value1 !== "object" || typeof value2 !== "object") {
          return false;
        }
        let objectHash = context.objectHash;
        if (!objectHash) {
          return context.matchByPosition && index1 === index2;
        }
        let hash1;
        let hash2;
        if (typeof index1 === "number") {
          context.hashCache1 = context.hashCache1 || [];
          hash1 = context.hashCache1[index1];
          if (typeof hash1 === "undefined") {
            context.hashCache1[index1] = hash1 = objectHash(value1, index1);
          }
        } else {
          hash1 = objectHash(value1);
        }
        if (typeof hash1 === "undefined") {
          return false;
        }
        if (typeof index2 === "number") {
          context.hashCache2 = context.hashCache2 || [];
          hash2 = context.hashCache2[index2];
          if (typeof hash2 === "undefined") {
            context.hashCache2[index2] = hash2 = objectHash(value2, index2);
          }
        } else {
          hash2 = objectHash(value2);
        }
        if (typeof hash2 === "undefined") {
          return false;
        }
        return hash1 === hash2;
      }
      function patch(params) {
        const context = {
          left: params.left,
          delta: params.delta,
          children: void 0,
          name: void 0,
          nested: false,
          stopped: false
        };
        function process(context2) {
          var _a;
          const steps = [
            nested_collectChildrenPatchFilter,
            array_collectChildrenPatchFilter,
            trivial_patchFilter,
            nested_patchFilter,
            array_patchFilter
          ];
          for (const step of steps) {
            step(context2);
            if (context2.stopped) {
              context2.stopped = false;
              break;
            }
          }
          if (context2.children) {
            for (const childrenContext of context2.children) {
              process(childrenContext);
              context2.result = (_a = context2.result) !== null && _a !== void 0 ? _a : context2.left;
              if ("result" in childrenContext === false) {
                delete context2.result[childrenContext.name];
              } else {
                context2.result[childrenContext.name] = childrenContext.result;
              }
            }
          }
        }
        process(context);
        return context.result;
      }
      function nested_collectChildrenPatchFilter(context) {
        if (!context || !context.children) {
          return;
        }
        if (context.delta._t) {
          return;
        }
        for (let child of context.children) {
          if (Object.prototype.hasOwnProperty.call(context.left, child.name) && child.result === void 0) {
            delete context.left[child.name];
          } else if (context.left[child.name] !== child.result) {
            context.left[child.name] = child.result;
          }
        }
        context.result = context.left;
        context.stopped = true;
      }
      function array_collectChildrenPatchFilter(context) {
        if (!context || !context.children) {
          return;
        }
        if (context.delta._t !== "a") {
          return;
        }
        let length = context.children.length;
        let child;
        for (let index = 0; index < length; index++) {
          child = context.children[index];
          context.left[child.name] = child.result;
        }
        context.result = context.left;
        context.stopped = true;
      }
      function trivial_patchFilter(context) {
        if (typeof context.delta === "undefined") {
          context.result = context.left;
          return;
        }
        context.nested = !Array.isArray(context.delta);
        if (context.nested) {
          return;
        }
        if (context.delta.length === 1) {
          context.result = context.delta[0];
          context.stopped = true;
          return;
        }
        if (context.delta.length === 2) {
          context.result = context.delta[1];
          context.stopped = true;
          return;
        }
        if (context.delta.length === 3 && context.delta[2] === 0) {
          context.stopped = true;
        }
      }
      function nested_patchFilter(context) {
        if (!context.nested) {
          return;
        }
        if (context.delta._t) {
          return;
        }
        for (let name in context.delta) {
          if (context.children === void 0) {
            context.children = [];
          }
          context.children.push({
            left: context.left[name],
            delta: context.delta[name],
            name,
            stopped: false
          });
        }
        context.stopped = true;
      }
      var ARRAY_MOVE$1 = 3;
      var compare = {
        numerically(a, b) {
          return a - b;
        },
        numericallyBy(name) {
          return (a, b) => a[name] - b[name];
        }
      };
      function array_patchFilter(context) {
        if (!context.nested) {
          return;
        }
        if (context.delta._t !== "a") {
          return;
        }
        let index;
        let index1;
        let delta = context.delta;
        let array = context.left;
        let toRemove = [];
        let toInsert = [];
        let toModify = [];
        for (index in delta) {
          if (index !== "_t") {
            if (index[0] === "_") {
              if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE$1) {
                toRemove.push(parseInt(index.slice(1), 10));
              } else {
                throw new Error(`only removal or move can be applied at original array indices, invalid diff type: ${delta[index][2]}`);
              }
            } else {
              if (delta[index].length === 1) {
                toInsert.push({
                  index: parseInt(index, 10),
                  value: delta[index][0]
                });
              } else {
                toModify.push({
                  index: parseInt(index, 10),
                  delta: delta[index]
                });
              }
            }
          }
        }
        toRemove = toRemove.sort(compare.numerically);
        for (index = toRemove.length - 1; index >= 0; index--) {
          index1 = toRemove[index];
          let indexDiff = delta[`_${index1}`];
          let removedValue = array.splice(index1, 1)[0];
          if (indexDiff[2] === ARRAY_MOVE$1) {
            toInsert.push({
              index: indexDiff[1],
              value: removedValue
            });
          }
        }
        toInsert = toInsert.sort(compare.numericallyBy("index"));
        let toInsertLength = toInsert.length;
        for (index = 0; index < toInsertLength; index++) {
          let insertion = toInsert[index];
          array.splice(insertion.index, 0, insertion.value);
        }
        let toModifyLength = toModify.length;
        if (toModifyLength > 0) {
          for (index = 0; index < toModifyLength; index++) {
            let modification = toModify[index];
            if (context.children === void 0) {
              context.children = [];
            }
            context.children.push({
              left: context.left[modification.index],
              delta: modification.delta,
              name: modification.index,
              stopped: false
            });
          }
        }
        if (!context.children) {
          context.result = context.left;
          context.stopped = true;
          return;
        }
      }
      exports.diff = diff2;
      exports.patch = patch;
    }
  });

  // demo.cjs
  var require_demo = __commonJS({
    "demo.cjs"(exports, module) {
      module.exports = require_json_patch_plus().diff;
    }
  });

  // node_modules/@n1ru4l/json-patch-plus/esm/index.js
  function defaultMatch(array1, array2, index1, index2) {
    return array1[index1] === array2[index2];
  }
  function lengthMatrix(array1, array2, match, context) {
    const len1 = array1.length;
    const len2 = array2.length;
    let matrix = Object.assign([len1 + 1], {
      match
    });
    for (let x = 0; x < len1 + 1; x++) {
      matrix[x] = [len2 + 1];
      for (let y = 0; y < len2 + 1; y++) {
        matrix[x][y] = 0;
      }
    }
    for (let x = 1; x < len1 + 1; x++) {
      for (let y = 1; y < len2 + 1; y++) {
        if (match(array1, array2, x - 1, y - 1, context)) {
          matrix[x][y] = matrix[x - 1][y - 1] + 1;
        } else {
          matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
        }
      }
    }
    return matrix;
  }
  function backtrack(matrix, array1, array2, context) {
    let index1 = array1.length;
    let index2 = array2.length;
    const subsequence = {
      sequence: [],
      indices1: [],
      indices2: []
    };
    while (index1 !== 0 && index2 !== 0) {
      const sameLetter = matrix.match(array1, array2, index1 - 1, index2 - 1, context);
      if (sameLetter) {
        subsequence.sequence.unshift(array1[index1 - 1]);
        subsequence.indices1.unshift(index1 - 1);
        subsequence.indices2.unshift(index2 - 1);
        --index1;
        --index2;
      } else {
        const valueAtMatrixAbove = matrix[index1][index2 - 1];
        const valueAtMatrixLeft = matrix[index1 - 1][index2];
        if (valueAtMatrixAbove > valueAtMatrixLeft) {
          --index2;
        } else {
          --index1;
        }
      }
    }
    return subsequence;
  }
  function get(array1, array2, match, context) {
    const innerContext = context || {};
    const matrix = lengthMatrix(array1, array2, match || defaultMatch, innerContext);
    return backtrack(matrix, array1, array2, innerContext);
  }
  function diff(input, options) {
    var _a;
    const includePreviousValue = (_a = options === null || options === void 0 ? void 0 : options.includePreviousValue) !== null && _a !== void 0 ? _a : false;
    const objectHash = options === null || options === void 0 ? void 0 : options.objectHash;
    const matchByPosition = options === null || options === void 0 ? void 0 : options.matchByPosition;
    const context = {
      result: void 0,
      left: input.left,
      right: input.right,
      includePreviousValue,
      objectHash,
      matchByPosition,
      stopped: false
    };
    function process(context2) {
      var _a2, _b;
      const steps = [
        nested_collectChildrenDiffFilter,
        trivialDiffFilter,
        nested_objectsDiffFilter,
        array_diffFilter
      ];
      for (const step of steps) {
        step(context2);
        if (context2.stopped) {
          context2.stopped = false;
          break;
        }
      }
      if ((_a2 = context2.children) === null || _a2 === void 0 ? void 0 : _a2.length) {
        for (const childrenContext of context2.children) {
          process(childrenContext);
          if (childrenContext.result !== void 0) {
            context2.result = (_b = context2.result) !== null && _b !== void 0 ? _b : {};
            context2.result[childrenContext.name] = childrenContext.result;
          }
        }
        if (context2.result && context2.leftIsArray) {
          context2.result._t = "a";
        }
      }
    }
    process(context);
    return context.result;
  }
  function trivialDiffFilter(context) {
    if (context.left === context.right) {
      context.result = void 0;
      context.stopped = true;
      return;
    }
    if (typeof context.left === "undefined") {
      context.result = [context.right];
      context.stopped = true;
      return;
    }
    if (typeof context.right === "undefined") {
      const previousValue = context.includePreviousValue ? context.left : null;
      context.result = [previousValue, 0, 0];
      context.stopped = true;
      return;
    }
    context.leftType = context.left === null ? "null" : typeof context.left;
    context.rightType = context.right === null ? "null" : typeof context.right;
    if (context.leftType !== context.rightType) {
      const previousValue = context.includePreviousValue ? context.left : null;
      context.result = [previousValue, context.right];
      context.stopped = true;
      return;
    }
    if (context.leftType === "boolean" || context.leftType === "number" || context.leftType === "string") {
      const previousValue = context.includePreviousValue ? context.left : null;
      context.result = [previousValue, context.right];
      context.stopped = true;
      return;
    }
    if (context.leftType === "object") {
      context.leftIsArray = Array.isArray(context.left);
    }
    if (context.rightType === "object") {
      context.rightIsArray = Array.isArray(context.right);
    }
    if (context.leftIsArray !== context.rightIsArray) {
      const previousValue = context.includePreviousValue ? context.left : null;
      context.result = [previousValue, context.right];
      context.stopped = true;
      return;
    }
  }
  function nested_collectChildrenDiffFilter(context) {
    if (!context || !context.children) {
      return;
    }
    const length = context.children.length;
    let child;
    let result = context.result;
    for (let index = 0; index < length; index++) {
      child = context.children[index];
      if (typeof child.result === "undefined") {
        continue;
      }
      result = result !== null && result !== void 0 ? result : {};
      result[child.name] = child.result;
    }
    if (result && context.leftIsArray) {
      result["_t"] = "a";
    }
    context.result = result;
    context.stopped = true;
  }
  function nested_objectsDiffFilter(context) {
    if (context.leftIsArray || context.leftType !== "object") {
      return;
    }
    const left = context.left;
    const right = context.right;
    for (const name in left) {
      if (!Object.prototype.hasOwnProperty.call(left, name)) {
        continue;
      }
      if (context.children === void 0) {
        context.children = [];
      }
      context.children.push({
        left: left[name],
        right: right[name],
        result: void 0,
        name,
        includePreviousValue: context.includePreviousValue,
        objectHash: context.objectHash,
        matchByPosition: context.matchByPosition,
        stopped: false
      });
    }
    for (const name in right) {
      if (!Object.prototype.hasOwnProperty.call(right, name)) {
        continue;
      }
      if (typeof left[name] === "undefined") {
        if (context.children === void 0) {
          context.children = [];
        }
        context.children.push({
          left: void 0,
          right: right[name],
          result: void 0,
          name,
          includePreviousValue: context.includePreviousValue,
          objectHash: context.objectHash,
          matchByPosition: context.matchByPosition,
          stopped: false
        });
      }
    }
    if (!context.children || context.children.length === 0) {
      context.result = void 0;
      context.stopped = true;
      return;
    }
    context.stopped = true;
  }
  var ARRAY_MOVE = 3;
  function array_diffFilter(context) {
    if (!context.leftIsArray) {
      return;
    }
    let matchContext = {
      objectHash: context.objectHash,
      matchByPosition: context.matchByPosition
    };
    let commonHead = 0;
    let commonTail = 0;
    let index;
    let index1;
    let index2;
    const array1 = context.left;
    const array2 = context.right;
    const len1 = array1.length;
    const len2 = array2.length;
    if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== "boolean") {
      matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
    }
    while (commonHead < len1 && commonHead < len2 && matchItems(array1, array2, commonHead, commonHead, matchContext)) {
      index = commonHead;
      const left = context.left;
      const right = context.right;
      if (context.children === void 0) {
        context.children = [];
      }
      context.children.push({
        left: left[index],
        right: right[index],
        result: void 0,
        name: index,
        includePreviousValue: context.includePreviousValue,
        objectHash: context.objectHash,
        matchByPosition: context.matchByPosition,
        stopped: false
      });
      commonHead++;
    }
    while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
      index1 = len1 - 1 - commonTail;
      index2 = len2 - 1 - commonTail;
      const left = context.left;
      const right = context.right;
      if (context.children === void 0) {
        context.children = [];
      }
      context.children.push({
        left: left[index1],
        right: right[index2],
        result: void 0,
        name: index2,
        includePreviousValue: context.includePreviousValue,
        objectHash: context.objectHash,
        matchByPosition: context.matchByPosition,
        stopped: false
      });
      commonTail++;
    }
    if (commonHead + commonTail === len1) {
      if (len1 === len2) {
        context.result = void 0;
        context.stopped = true;
        return;
      }
      const result2 = {
        _t: "a"
      };
      for (index = commonHead; index < len2 - commonTail; index++) {
        result2[index] = [array2[index]];
      }
      context.result = result2;
      context.stopped = true;
      return;
    }
    if (commonHead + commonTail === len2) {
      const result2 = {
        _t: "a"
      };
      for (index = commonHead; index < len1 - commonTail; index++) {
        result2[`_${index}`] = [
          context.includePreviousValue ? array1[index] : null,
          0,
          0
        ];
      }
      context.result = result2;
      context.stopped = true;
      return;
    }
    delete matchContext.hashCache1;
    delete matchContext.hashCache2;
    let trimmed1 = array1.slice(commonHead, len1 - commonTail);
    let trimmed2 = array2.slice(commonHead, len2 - commonTail);
    let seq = get(trimmed1, trimmed2, matchItems, matchContext);
    let removedItems = [];
    const result = {
      _t: "a"
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      if (seq.indices1.indexOf(index - commonHead) < 0) {
        result[`_${index}`] = [
          context.includePreviousValue ? array1[index] : null,
          0,
          0
        ];
        removedItems.push(index);
      }
    }
    let removedItemsLength = removedItems.length;
    for (index = commonHead; index < len2 - commonTail; index++) {
      let indexOnArray2 = seq.indices2.indexOf(index - commonHead);
      if (indexOnArray2 < 0) {
        let isMove = false;
        if (removedItemsLength > 0) {
          for (let removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
            index1 = removedItems[removeItemIndex1];
            if (matchItems(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
              result[`_${index1}`].splice(1, 2, index, ARRAY_MOVE);
              index2 = index;
              if (context.children === void 0) {
                context.children = [];
              }
              const left = context.left;
              const right = context.right;
              context.children.push({
                left: left[index1],
                right: right[index2],
                result: void 0,
                name: index2,
                includePreviousValue: context.includePreviousValue,
                objectHash: context.objectHash,
                matchByPosition: context.matchByPosition,
                stopped: false
              });
              removedItems.splice(removeItemIndex1, 1);
              isMove = true;
              break;
            }
          }
        }
        if (!isMove) {
          result[index] = [array2[index]];
        }
      } else {
        index1 = seq.indices1[indexOnArray2] + commonHead;
        index2 = seq.indices2[indexOnArray2] + commonHead;
        if (context.children === void 0) {
          context.children = [];
        }
        const left = context.left;
        const right = context.right;
        context.children.push({
          left: left[index1],
          right: right[index2],
          result: void 0,
          name: index2,
          includePreviousValue: context.includePreviousValue,
          objectHash: context.objectHash,
          matchByPosition: context.matchByPosition,
          stopped: false
        });
      }
    }
    context.result = result;
    context.stopped = true;
  }
  function arraysHaveMatchByRef(array1, array2, len1, len2) {
    for (let index1 = 0; index1 < len1; index1++) {
      let val1 = array1[index1];
      for (let index2 = 0; index2 < len2; index2++) {
        let val2 = array2[index2];
        if (index1 !== index2 && val1 === val2) {
          return true;
        }
      }
    }
    return false;
  }
  function matchItems(array1, array2, index1, index2, context) {
    let value1 = array1[index1];
    let value2 = array2[index2];
    if (value1 === value2) {
      return true;
    }
    if (typeof value1 !== "object" || typeof value2 !== "object") {
      return false;
    }
    let objectHash = context.objectHash;
    if (!objectHash) {
      return context.matchByPosition && index1 === index2;
    }
    let hash1;
    let hash2;
    if (typeof index1 === "number") {
      context.hashCache1 = context.hashCache1 || [];
      hash1 = context.hashCache1[index1];
      if (typeof hash1 === "undefined") {
        context.hashCache1[index1] = hash1 = objectHash(value1, index1);
      }
    } else {
      hash1 = objectHash(value1);
    }
    if (typeof hash1 === "undefined") {
      return false;
    }
    if (typeof index2 === "number") {
      context.hashCache2 = context.hashCache2 || [];
      hash2 = context.hashCache2[index2];
      if (typeof hash2 === "undefined") {
        context.hashCache2[index2] = hash2 = objectHash(value2, index2);
      }
    } else {
      hash2 = objectHash(value2);
    }
    if (typeof hash2 === "undefined") {
      return false;
    }
    return hash1 === hash2;
  }

  // index.js
  var import_demo2 = __toModule(require_demo());
  console.log(diff === import_demo2.default);
})();
