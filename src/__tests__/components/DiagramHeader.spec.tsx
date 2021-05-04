/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React from 'react';
import {
  view_explore,
} from "../../test_data";
import { DiagramHeader } from '../../components/DiagramFrame/DiagramHeader'
import { shallow } from 'enzyme';
import 'jest-styled-components'

// jest.mock("@looker/components", () => ({
//   Heading: () => "Heading",
//   Header: () => "Header",
//   Space: () => "Space",
//   IconButton: () => "IconButton",
//   theme: {colors: {key:"rgb(45, 126, 234)"}, space: {large: "2em"}, fontSizes: {large: "2em"}, fontWeights: {normal: "1em"}}
// }))

// jest.mock("styled-components", () => ({
//   DiagramHeaderWrapper: () => "DiagramHeaderWrapper",
//   SettingsPanel: () => "SettingsPanel",
//   Italics: () => "Italics",
//   span: () => "span",
//   styled: () => "styled"
// }))

describe('<DiagramHeader />', () => {
  const basic = shallow(
  <DiagramHeader
    currentExplore={view_explore}
    selectionInfo={{}}
    toggleExploreInfo={undefined}
  />);
  it('should match the basic diagram header', () => {
    expect(basic.debug()).toMatchSnapshot();
  });
});
