$(document).ready(function() {
  var lineToString = _.debounce(function() {
    var value  = $(this).val()
    var result = value.replace(/\n/g, $('#l2s-replace').val())

    $('#l2s-output').val(result)
  }, 100)

  var textDiff = _.debounce(function() {
    console.log('calculating diff')

    var from = $('#diff-from').val()
    var to   = $('#diff-to').val()
    var diff = Diff.diffChars(from, to)

    var insertions = 0
    var deletions  = 0
    var identicals = 0

    $('#diff').empty()

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
  }, 100)

  $('textarea.diff').on('input', textDiff)
  $('#l2s-replace').on('input', lineToString)
  $('#l2s-input').on('input', lineToString)
})