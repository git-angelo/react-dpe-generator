import React, { Component } from 'react'

class Diag extends Component {
  // Default options is DPE
  defaultOptions = {
    width: 250,
    height: 200,
    value: 200,
    valuesRange: [
      {
        min: null,
        max: 50,
        color: '#009C6D',
        textColor: '#ffffff',
        label: 'A'
      },
      {
        min: 51,
        max: 90,
        color: '#52B153',
        textColor: '#ffffff',
        label: 'B'
      },
      {
        min: 91,
        max: 150,
        color: '#78BD76',
        textColor: '#ffffff',
        label: 'C'
      },
      {
        min: 151,
        max: 230,
        color: '#F4E70F',
        textColor: '#ffffff',
        label: 'D'
      },
      {
        min: 231,
        max: 330,
        color: '#F0B50F',
        textColor: '#ffffff',
        label: 'E'
      },
      {
        min: 331,
        max: 450,
        color: '#EB8235',
        textColor: '#ffffff',
        label: 'F'
      },
      {
        min: 451,
        max: null,
        color: '#D7221F',
        textColor: '#ffffff',
        label: 'G'
      }
    ],
    shadow: false,
    lang: 'fr',
    pad: 5,
    shape: 'sharp'
  }

  svgNS = 'http://www.w3.org/2000/svg'

  constructor(props) {
    super(props)
    this.state = {
      width: props.width || this.defaultOptions.width,
      height: props.height || this.defaultOptions.height,
      value: props.value || this.defaultOptions.value,
      shadow: props.shadow || this.defaultOptions.shadow,
      lang: props.lang || this.defaultOptions.lang,
      pad: props.pad || this.defaultOptions.pad,
      shape: props.shape || this.defaultOptions.shape
    }

    this.container = React.createRef()

    this.getValuesDatas = this.getValuesDatas.bind(this)
    this.getScore = this.getScore.bind(this)
    this.setAttributes = this.setAttributes.bind(this)
    this.getPath = this.getPath.bind(this)
    this.getPolygon = this.getPolygon.bind(this)
    this.getText = this.getText.bind(this)
    this.createSVG = this.createSVG.bind(this)
    this.update = this.update.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.value !== this.props.value
  }

  getValuesDatas() {
    const values = []
    const colors = []
    const labels = []

    var toTxt = ' à '
    switch (this.state.lang) {
      case 'fr':
        toTxt = ' à '
        break
      case 'en':
        toTxt = ' to '
        break
    }
    this.props.valuesRange.forEach(function (value) {
      if (value.min === null && value.max !== null) {
        values.push('≤ ' + value.max)
      } else if (value.min !== null && value.max !== null) {
        values.push(value.min + toTxt + value.max)
      } else if (value.min !== null && value.max === null) {
        values.push('> ' + (value.min - 1))
      }
      colors.push(value.color)
      labels.push(value.label)
    })

    return {
      values: values,
      colors: colors,
      labels: labels
    }
  }

  getScore() {
    let score = -1
    for (const values of this.props.valuesRange) {
      score++
      if (typeof this.state.value === 'string') {
        if (this.state.value === values.label) {
          break
        }
      } else if (values.min === null && values.max !== null) {
        if (this.state.value <= values.max) {
          break
        }
      } else if (values.min !== null && values.max !== null) {
        if (this.state.value >= values.min && this.state.value <= values.max) {
          break
        }
      } else if (values.min !== null && values.max === null) {
        if (this.state.value >= values.min) {
          break
        }
      }
    }
    return score
  }

  setAttributes(elem, o) {
    if (o.fill) {
      elem.setAttribute('fill', o.fill)
    }
    if (o.fontSize) {
      elem.setAttribute('font-size', o.fontSize)
    }
    if (o.fontFamily) {
      elem.setAttribute('font-family', o.fontFamily)
    }
    if (o.textAnchor) {
      elem.setAttribute('text-anchor', o.textAnchor)
    }
    if (o.fontWeight) {
      elem.setAttribute('font-weight', o.fontWeight)
    }
    if (o.strokeWidth) {
      elem.setAttribute('stroke-width', o.strokeWidth)
    }
    if (o.stroke) {
      elem.setAttribute('stroke', o.stroke)
    }
    if (o.opacity) {
      elem.setAttribute('opacity', o.opacity)
    }
  }

  getPath(path, options) {
    var elem = document.createElementNS(this.svgNS, 'path')
    this.setAttributes(elem, options)
    elem.setAttribute('d', path)
    return elem
  }

  getPolygon(points, color) {
    var elem = document.createElementNS(this.svgNS, 'polygon')
    elem.setAttribute(
      'style',
      'fill-opacity: 1;fill: ' +
        color +
        ';stroke: #000000;' +
        (this.state.shadow ? 'filter:url(#fs)' : '')
    )
    elem.setAttribute('points', points)
    return elem
  }

  getText(text) {
    var elem = document.createElementNS(this.svgNS, 'text')
    elem.setAttribute('x', text.x)
    elem.setAttribute('y', text.y)
    elem.textContent = text.text
    this.setAttributes(elem, text.options)
    return elem
  }

  createSVG() {
    const score = this.getScore()
    const datas = this.getValuesDatas()

    var svg = document.createElementNS(this.svgNS, 'svg')
    svg.setAttribute('style', 'overflow: hidden; position: relative;')
    svg.setAttribute('width', this.state.width)
    svg.setAttribute('height', this.state.height)
    svg.setAttribute('version', '1.1')
    svg.setAttribute(
      'viewBox',
      '0 0 ' + this.state.width + ' ' + this.state.height
    )
    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    )

    var desc = document.createElementNS(this.svgNS, 'desc')
    desc.textContent = 'Created by Pascalz (http://pascalz.github.io/dpeges/)'
    svg.appendChild(desc)
    var defs = document.createElementNS(this.svgNS, 'defs')
    var filter = document.createElementNS(this.svgNS, 'filter')
    filter.setAttribute('id', 'fs')
    // filter.setAttribute("height", "120%");

    var feGaussianBlur = document.createElementNS(this.svgNS, 'feGaussianBlur')
    feGaussianBlur.setAttribute('in', 'SourceAlpha')
    feGaussianBlur.setAttribute('stdDeviation', '1')
    filter.appendChild(feGaussianBlur)

    var feOffset = document.createElementNS(this.svgNS, 'feOffset')
    feOffset.setAttribute('result', 'offsetblur')
    feOffset.setAttribute('dx', '1')
    feOffset.setAttribute('dy', '0.5')
    filter.appendChild(feOffset)

    var feMerge = document.createElementNS(this.svgNS, 'feMerge')
    var feMergeNode1 = document.createElementNS(this.svgNS, 'feMergeNode')
    feMerge.appendChild(feMergeNode1)
    var feMergeNode2 = document.createElementNS(this.svgNS, 'feMergeNode')
    feMergeNode2.setAttribute('in', 'SourceGraphic')
    feMerge.appendChild(feMergeNode2)
    filter.appendChild(feMerge)
    defs.appendChild(filter)
    svg.appendChild(defs)

    var countElem = datas.values.length

    var blocHeight =
      (this.state.height - (countElem + 1) * this.state.pad) / countElem
    var blocWidth = this.state.width - 2 * this.state.pad - 45

    var blocPart = ((blocWidth / 3) * 2) / (countElem - 1)
    blocWidth = blocWidth / 3

    for (var i = 0; i < countElem; i++) {
      var x, y, x1, y1, x2, y2, poly
      x = this.state.pad
      y = i * this.state.pad + this.state.pad + i * blocHeight

      switch (this.state.shape) {
        case 'sharp':
          x1 = blocWidth + blocPart * i - blocHeight / 2

          x2 = x + (blocWidth + blocPart * i)
          y1 = y + blocHeight / 2

          y2 = y + blocHeight
          poly =
            x +
            ',' +
            y +
            ' ' +
            x1 +
            ',' +
            y +
            ' ' +
            x2 +
            ',' +
            y1 +
            ' ' +
            x1 +
            ',' +
            y2 +
            ' ' +
            x +
            ',' +
            y2 +
            ' ' +
            x +
            ',' +
            y
          break
        case 'flat':
          x1 = x + (blocWidth + blocPart * i)

          y1 = y + blocHeight
          poly =
            x +
            ',' +
            y +
            ' ' +
            x1 +
            ',' +
            y +
            ' ' +
            x1 +
            ',' +
            y1 +
            ' ' +
            x +
            ',' +
            y1 +
            ' ' +
            x +
            ',' +
            y
          break
      }

      if (score === i) {
        var sx1 = x - 2
        var sx2 = this.state.width - 2 * this.state.pad + 2
        var sy1 = y - 2
        var sy2 = y + blocHeight + 3

        var scorePath =
          'M ' +
          sx1 +
          ' ' +
          sy1 +
          'L' +
          sx2 +
          ' ' +
          sy1 +
          'L' +
          sx2 +
          ' ' +
          sy2 +
          'L' +
          sx1 +
          ' ' +
          sy2 +
          ' Z'
        svg.appendChild(
          this.getPath(scorePath, {
            stroke: '#5b5b5b',
            strokeWidth: 1,
            fill: '#ffffff',
            fillOpacity: 0.8
          })
        )

        svg.appendChild(
          this.getText({
            x: sx2 - 5,
            y: y + blocHeight * 0.9,
            text: this.state.value,
            options: {
              fill: '#000000',
              fontSize: blocHeight * 0.9,
              fontWeight: 'bold',
              fontFamily: "'Arial Narrow', sans-serif",
              textAnchor: 'end'
            }
          })
        )
      }

      svg.appendChild(this.getPolygon(poly, datas.colors[i]))

      var whiteIdx = this.state.shape === 'sharp' ? -1 : -1

      svg.appendChild(
        this.getText({
          x: x1 - this.state.pad,
          y: y + blocHeight * 0.8,
          text: datas.labels[i],
          options: {
            fill: i > whiteIdx ? '#ffffff' : '#000000',
            fontSize: blocHeight * 0.8,
            fontWeight: 'bold',
            fontFamily: "'Arial Narrow', sans-serif",
            textAnchor: 'end'
          }
        })
      )
      svg.appendChild(
        this.getText({
          x: x + this.state.pad,
          y: y + blocHeight - (blocHeight * 0.6) / 2,
          text: datas.values[i],
          options: {
            fill: i > whiteIdx ? '#ffffff' : '#000000',
            fontSize: blocHeight * 0.6,
            fontFamily: "'Arial Narrow', sans-serif",
            textAnchor: 'start'
          }
        })
      )
    }
    return svg
  }

  update() {
    let child
    while ((child = this.container.lastElementChild)) {
      this.container.removeChild(child)
    }
    this.container.appendChild(this.createSVG())
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate() {
    this.update()
  }

  render() {
    return <div ref={(DOMNodeRef) => (this.container = DOMNodeRef)} />
  }
}

export function DPE(props) {
  const valuesRange = [
    {
      min: null,
      max: 50,
      color: '#009C6D',
      textColor: '#ffffff',
      label: 'A'
    },
    {
      min: 51,
      max: 90,
      color: '#52B153',
      textColor: '#ffffff',
      label: 'B'
    },
    {
      min: 91,
      max: 150,
      color: '#78BD76',
      textColor: '#ffffff',
      label: 'C'
    },
    {
      min: 151,
      max: 230,
      color: '#F4E70F',
      textColor: '#ffffff',
      label: 'D'
    },
    {
      min: 231,
      max: 330,
      color: '#F0B50F',
      textColor: '#ffffff',
      label: 'E'
    },
    {
      min: 331,
      max: 450,
      color: '#EB8235',
      textColor: '#ffffff',
      label: 'F'
    },
    {
      min: 451,
      max: null,
      color: '#D7221F',
      textColor: '#ffffff',
      label: 'G'
    }
  ]

  return <Diag {...props} valuesRange={valuesRange} shape='sharp' />
}

export function GES(props) {
  const valuesRange = [
    {
      min: null,
      max: 5,
      color: '#A4DBF8',
      textColor: '#ffffff',
      label: 'A'
    },
    {
      min: 6,
      max: 10,
      color: '#8CB4D3',
      textColor: '#ffffff',
      label: 'B'
    },
    {
      min: 11,
      max: 20,
      color: '#7792B1',
      textColor: '#ffffff',
      label: 'C'
    },
    {
      min: 21,
      max: 35,
      color: '#7792B1',
      textColor: '#ffffff',
      label: 'D'
    },
    {
      min: 36,
      max: 55,
      color: '#4D5271',
      textColor: '#ffffff',
      label: 'E'
    },
    {
      min: 56,
      max: 80,
      color: '#393551',
      textColor: '#ffffff',
      label: 'F'
    },
    {
      min: 81,
      max: null,
      color: '#140622',
      textColor: '#ffffff',
      label: 'G'
    }
  ]

  return <Diag {...props} valuesRange={valuesRange} shape='flat' />
}
