$(document).ready(function() {
  $('#l2s-input').on('input', function() {
    value  = $(this).val()
    result = value.replace(/\n/g, $('#l2s-replace').val())

    $('#l2s-output').val(result)
  })

  $('#l2s-replace').on('input', function() {
    value  = $('#l2s-input').val()
    result = value.replace(/\n/g, $(this).val())

    $('#l2s-output').val(result)
  })
})