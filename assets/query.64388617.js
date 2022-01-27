var n=[{routepath:"README",content:`## Home page

This is a demo for wiki theme. No frontmatter is provided.
`},{routepath:"folder1/file1",content:`---
title: Hello file1
date: 2021-02-20
subtitle: This is a demo mdx file
tags:
  - markdown
  - folder1
---

file1
`},{routepath:"hello-world",content:`---
title: Hello world
date: 2021-02-25
subtitle: This is a demo mdx file
tags:
  - markdown
---

# title1 -> h1

## title2 -> h2

### title3 -> h3

#### title4 -> h4

##### title5 -> h5

###### title6 -> h6

# Text

Plain Text -> p

## escape

\\## escape

## text style

**bold** -> strong

_Italic_ -> em

**_bold and italic_** -> strong + em

~one~ or ~~two~~ tildes.

A note[^1]

## Quote

> Quote -> backquote
>
> > nested quote -> backquote
>
> - bullet point

# List

- bullet point1 -> ul li
  - nested bullet point2

1. point1 -> ol li
2. point2
   1. nested point

- [ ] to do
- [x] done

# Table

| a   | b   |   c |  d  |
| --- | :-- | --: | :-: |

# Link

[formated link](https://reactjs.org) -> a

# Code

\`simple quote\` -> code

\`\`\`jsx
function App() {
  return <div></div>;
}
render(<App />, document.getElementById('root'));
\`\`\`

\`\`\`diff
- import { DatePicker, message } from 'antd';
+ import { DatePicker, message, Alert } from 'antd';
\`\`\`

# Image

## html image

<img
  width="420"
  src="https://gw.alipayobjects.com/zos/antfincdn/JrXptUm1Nz/6b50edc4-3a3c-4b2a-843e-f9f0af2c4667.png"
  alt="codesandbox screenshot"
/>

## image link

![console warning](https://zos.alipayobjects.com/rmsportal/GHIRszVcmjccgZRakJDQ.png)

# HTML

<em>word</em>

<hr />

<strong>test</strong>

# MDX Component

import { FirstExample } from './FirstExample';

<FirstExample />

# Frontmatter

export const test = 'frontmatter test';

{test}

## Math latex

$$
e^{j\\theta} = cos(\\theta) + jsin(\\theta)
$$
`},{routepath:"folder1/nested/file2",content:`---
title: Hello file2
date: 2021-02-20
subtitle: This is a demo mdx file
tags:
  - markdown
  - folder2
  - folder1
---

file2
`}];export{n as default};
