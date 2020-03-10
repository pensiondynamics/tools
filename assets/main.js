$(document).ready(function() {
  var lineToString = _.debounce(function() {
    var value  = $(this).val()
    var result = value.replace(/\n/g, $('#l2s-replace').val())

    $('#l2s-output').val(result)
  }, 500)

  var leven = _.debounce(function() {
    var from = $('#leven-from').val()
    var to   = $('#leven-to').val()
    var ic   = $('#ignore-case')
    var lmt  = parseFloat($('#threshold').val())
    var trnc = $('#truncate').val()
    var tkn  = $('#tokenize').val()

    if (trnc.length > 0) {
      var regex = new RegExp(truncate)
    } else {
      var regex = null
    }

    $('#leven').empty()

    if (from.length > 0 && to.length > 0) {
      var from_arry = from.split(/\n/)
      var to_arry   = to.split(/\n/)

      from_arry.forEach(function(from_line) {
        if (regex) {
          var ar = from_line.match(regex)
          var a  = from_line.substring(0, ar.index)
        } else {
          var a = from_line
        }

        var similarities = to_arry.map(function(to_line) {
          if (regex) {
            var br = to_line.match(regex)
            var b  = to_line.substring(0, ar.index)
          } else {
            var b = to_line
          }

          var max  = Math.max(a.length, b.length)
          var dist = levenshtein(a, b, ic.is(':checked'))
          var amnt = ((max - dist) / max) * 100

          if (amnt > lmt) {
            return amnt
          } else {
            return 0
          }
        })

        var max = Math.max(...similarities)
        var idx = similarities.findIndex(function(value) {
          return value == max
        })

        var tr = $('<tr></tr>')
        var td = $('<td></td>')
        
        tr.append(td.clone().text(from_line))

        if (max > lmt) {
          tr.append(td.clone().text(to_arry[idx]))
          tr.append(td.addClass('text-right').text(max.toFixed(2)))
        } else {
          tr.append(td.clone())
          tr.append(td)
        }

        $('#leven').append(tr)
      })
    }
  }, 500)

  var textDiff = _.debounce(function() {
    var from = $('#diff-from').val()
    var to   = $('#diff-to').val()
    var dmp  = new diff_match_patch()
    var diff = dmp.diff_main(from, to)
    // var diff = Diff.diffChars(from, to)

    console.log(diff)

    var insertions = 0
    var deletions  = 0
    var identicals = 0

    $('#diff').empty()

    dmp.diff_cleanupSemantic(diff)

    /**
    diff.forEach(function(part) {
      node = document.createElement(part.added ? 'ins' : part.removed ? 'del' : 'span')
      node.appendChild(document.createTextNode(part.value))

      if (part.added) {
        insertions += 1
      } else if (part.removed) {
        deletions += 1
      } else {
        identicals += 1
      }

      $('#diff').append(node)
      $('#insertion-count').text(insertions)
      $('#deletion-count').text(deletions)
      $('#no-changes-count').text(identicals)
    })
    **/

    var ds = dmp.diff_prettyHtml(diff)

    $('#diff').html(ds)
  }, 500)

  $('textarea.diff').on('input', textDiff)
  $('#l2s-replace').on('input', lineToString)
  $('#l2s-input').on('input', lineToString)
  $('textarea.leven').on('input', leven)
  $('#ignore-case').prop('checked', true)
  $('#ignore-case').on('change', leven)
  $('#threshold').on('change', leven)
  $('#truncate').on('change', leven)
})

function levenshtein(a, b, caseless, truncate) {
  if (caseless) {
    a = a.toLowerCase()
    b = b.toLowerCase()
  }

  var al = a.length
  var bl = b.length
  var arry = []

  for (var i = 0; i <= al; i++) {
    arry[i] = []

    for (var j = 0; j <= bl; j++) {
      if (i == 0) {
        arry[i][j] = j
      } else if (j == 0) {
        arry[i][j] = i
      } else {
        arry[i][j] = 0
      }
    }
  }

  for (var i = 1; i <= al; i++) {
    for (var j = 1; j <= bl; j++) {
      var cost = a[i - 1] == b[j - 1] ? 0 : 1

      arry[i][j] = Math.min(...[
        arry[i - 1][j] + 1,
        arry[i][j - 1] + 1,
        arry[i - 1][j - 1] + cost
      ])
    }
  }

  return arry[al][bl]
}
