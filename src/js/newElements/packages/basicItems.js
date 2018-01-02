module.exports = {
  name: 'Basic',
  description: 'Basic HTML elements without any styling',
  icon: require('../../../img/basicElements/Section.svg'),
  cssDependency: [],
  jsDependency: [],
  css: '',
  js: '',
  content: [
    {
      name: 'Layout',
      items: [
        {
          name: 'Section',
          icon: require('../../../img/basicElements/Section.svg'),
          description: `"The HTML section element represents a standalone section — which doesnt have a more specific semantic element to represent it — contained within an HTML document. Typically, but not always, sections have a heading." - developer.mozilla.org`,
          html: `<section></section>`
        },
        {
          name: 'Container',
          icon: require('../../../img/basicElements/Container.svg'),
          description: `"The HTML Content Division element (div) is the generic container for flow content. It has no effect on the content or layout until styled using CSS. As a "pure" container, the div element does not inherently represent anything. Instead, its used to group content so it can be easily styled using the class or id attributes, marking a section of a document as being written in a different language (using the lang attribute), and so on." - developer.mozilla.org`,
          html: `<div></div>`
        },
        {
          name: 'Main',
          icon: require('../../../img/basicElements/Main.svg'),
          description: `"The HTML main element represents the main content of the body of a document, portion of a document, or application. The main content area consists of content that is directly related to, or expands upon the central topic of, a document or the central functionality of an application." - developer.mozilla.org`,
          html: `<main></main>`
        },
        {
          name: 'Header',
          icon: require('../../../img/basicElements/Header.svg'),
          description: `"The HTML header element represents introductory content, typically a group of introductory or navigational aids. It may contain some heading elements but also other elements like a logo, a search form, an author name, and so on." - developer.mozilla.org`,
          html: `<header></header>`
        },
        {
          name: 'Footer',
          icon: require('../../../img/basicElements/Footer.svg'),
          description: `"The HTML footer element represents a footer for its nearest sectioning content or sectioning root element. A footer typically contains information about the author of the section, copyright data or links to related documents." - developer.mozilla.org`,
          html: `<footer></footer>`
        }
      ]
    },
    {
      name: 'Typography',
      items: [
        {
          name: 'Heading',
          icon: require('../../../img/basicElements/Heading.svg'),
          description: `The Header to describe the following section`,
          html: `<h1> Lorem ipsum dolor sit amet </h1>`
        },
        {
          name: 'Paragraph',
          icon: require('../../../img/basicElements/Paragraph.svg'),
          description: `"The HTML p element represents a paragraph of text. Paragraphs are usually represented in visual media as blocks of text that are separated from adjacent blocks by vertical blank space and/or first-line indentation." - developer.mozilla.org`,
          html: `<p> Lorem ipsum dolor sit amet </p>`
        },
        {
          name: 'Link',
          icon: require('../../../img/basicElements/Link.svg'),
          description: `"The HTML a element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL." - developer.mozilla.org`,
          html: `<a href="#"> Lorem ipsum dolor sit amet </a>`
        },
        {
          name: 'Blockquote',
          icon: require('../../../img/basicElements/Blockquote.svg'),
          description: `"The HTML blockquote Element (or HTML Block Quotation Element) indicates that the enclosed text is an extended quotation." - developer.mozilla.org`,
          html: `<blockquote> Lorem ipsum dolor sit amet </blockquote>`
        },
        {
          name: 'Thematic break',
          icon: require('../../../img/basicElements/Hr.svg'),
          description: `"The HTML hr element represents a thematic break between paragraph-level elements (for example, a change of scene in a story, or a shift of topic with a section); historically, this has been presented as a horizontal rule or line. While it may still be displayed as a horizontal rule in visual browsers, this element is now defined in semantic terms, rather than presentational terms, so if you wish to draw a horizontal line, you should do so using appropriate CSS." - developer.mozilla.org`,
          html: `<hr>`
        }
      ]
    },
    {
      name: 'Media',
      items: [
        {
          name: 'Image',
          icon: require('../../../img/basicElements/Image.svg'),
          description: `"The HTML img element embeds an image into the document." - developer.mozilla.org`,
          html: `<img src="#" alt="" >`
        },
        {
          name: 'Audio',
          icon: require('../../../img/basicElements/Audio.svg'),
          description: `"The HTML audio element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream." - developer.mozilla.org`,
          html: `<audio controls="controls">
                  Your browser does not support the <code>audio</code> element.
                  <source src="#" type="#">
                </audio>`
        },
        {
          name: 'Video',
          icon: require('../../../img/basicElements/Video.svg'),
          description: `"Use the HTML video element to embed video content in a document." - developer.mozilla.org`,
          html: `<video width="400" controls>
                    <source src="" type="">
                    Your browser does not support HTML5 video.
                 </video>`
        }
      ]
    },
    {
      name: 'Lists',
      items: [
        {
          name: 'Ordered List',
          icon: require('../../../img/basicElements/Ol.svg'),
          description: '"The HTML ol element represents an ordered list of items, typically rendered as a numbered list." - developer.mozilla.org',
          html: `<ol>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ol>`
        },
        {
          name: 'Unordered List',
          icon: require('../../../img/basicElements/Ul.svg'),
          description: '"The HTML ul element represents an unordered list of items, typically rendered as a bulleted list." - developer.mozilla.org',
          html: `<ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
          </ul>`
        },
        {
          name: 'List Item',
          icon: require('../../../img/basicElements/Li.svg'),
          description: '"The HTML li element is used to represent an item in a list. It must be contained in a parent element: an ordered list (ol), an unordered list (ul), or a menu (menu). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter." - developer.mozilla.org',
          html: `<li>I am a list item :§</li>`
        }
      ]
    },
    {
      name: 'Forms',
      items: [
        {
          name: 'Form Block',
          icon: require('../../../img/basicElements/FormBlock.svg'),
          description: '"The HTML form element represents a document section that contains interactive controls to submit information to a web server." - developer.mozilla.org',
          html: `<form class="" action="" method="post">
                </form>`
        },
        {
          name: 'Label',
          icon: require('../../../img/basicElements/Label.svg'),
          description: '"The HTML label element represents a caption for an item in a user interface." - developer.mozilla.org',
          html: `<label for=""></label>`
        },
        {
          name: 'Input',
          icon: require('../../../img/basicElements/Input.svg'),
          description: '"The HTML input element is used to create interactive controls for web-based forms in order to accept data from the user." - developer.mozilla.org',
          html: `<input type="text" name="" value="">`
        },
        {
          name: 'Text Area',
          icon: require('../../../img/basicElements/Textarea.svg'),
          description: '"The HTML textarea element represents a multi-line plain-text editing control." - developer.mozilla.org',
          html: `<textarea name="name" rows="8" cols="80"></textarea>`
        },
        {
          name: 'Checkbox',
          icon: require('../../../img/basicElements/Checkbox.svg'),
          description: '"input elements of type checkbox are rendered by default as square boxes that are checked (ticked) when activated, like you might see in an official government paper form. They allow you to select single values for submission in a form (or not)." - developer.mozilla.org',
          html: `<input type="checkbox" name="" value="">`
        },
        {
          name: 'Radio',
          icon: require('../../../img/basicElements/Radio.svg'),
          description: '"input elements of type radio are generally used in radio groups—collections of radio buttons describing a set of related options. Only one radio button in a given group can be selected at the same time. Radio buttons are typically rendered as small circles, which are filled or highlighted when selected." - developer.mozilla.org',
          html: `<input type="radio" name="" value="">`
        },
        {
          name: 'Select',
          icon: require('../../../img/basicElements/Select.svg'),
          description: '"The HTML select element represents a control that provides a menu of options" - developer.mozilla.org',
          html: `<select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>`
        },
        {
          name: 'Option',
          icon: require('../../../img/basicElements/Option.svg'),
          description: '"The HTML option element is used to define an item contained in a select, an optgroup, or a datalist element. As such, option can represent menu items in popups and other lists of items in an HTML document." - developer.mozilla.org',
          html: `<option value="1">1</option>`
        },
        {
          name: 'Submit',
          icon: require('../../../img/basicElements/Submit.svg'),
          description: 'Submit the form',
          html: `<button type="submit" name="action">Submit</button>`
        },
        {
          name: 'Reset',
          icon: require('../../../img/basicElements/Reset.svg'),
          description: 'Reset the form',
          html: `<button type="reset" name="action">Reset</button>`
        }
      ]
    }
  ]
}
