const basicElementItems = [
  {
    name: 'Layout',
    items: [
      {
        name: 'Section',
        icon: require('../../img/test.svg'),
        tags: ['section', 'sections'],
        info: '',
        html: `<section></section>`
      },
      {
        name: 'Container',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<div></div>`
      },
      {
        name: 'Colum',
        icon: require('../../img/test.svg'),
        run: ''
      }
    ]
  },
  {
    name: 'Typography',
    items: [
      {
        name: 'Heading',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<h1> Lorem ipsum dolor sit amet </h1>`
      },
      {
        name: 'Paragraph',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<p> Lorem ipsum dolor sit amet </p>`
      },
      {
        name: 'Link',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<a href="#"> Lorem ipsum dolor sit amet </a>`
      },
      {
        name: 'Blockquote',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<blockquote> Lorem ipsum dolor sit amet </blockquote>`
      }
    ]
  },
  {
    name: 'Media',
    items: [
      {
        name: 'Image',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<img src="#" alt="" >`
      },
      {
        name: 'Icon',
        icon: require('../../img/test.svg'),
        info: '',
        run: ''
      },
      {
        name: 'Video',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<video width="400" controls>
                  <source src="" type="">
                  Your browser does not support HTML5 video.
               </video>`
      }
    ]
  },
  {
    name: 'Forms',
    items: [
      {
        name: 'From Block',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<form class="" action="" method="post">
              </form>`
      },
      {
        name: 'Field Label',
        icon: require('../../img/test.svg'),
        info: '',
        html: `<form class="" action="" method="post">
              </form>`
      }
    ]
  },
  {
    name: 'Page',
    items: [

    ]
  },
  {
    name: 'Misc',
    items: [

    ]
  }
]

module.exports = basicElementItems
