<>
<script src="https://code.jquery.com/jquery-3.5.1.js"
          integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc="
          crossorigin="anonymous"></script>
 
<script type="text/javascript">
         $.(document).on('submit','#todo-form',function(e)
                       {
          console.log('hello');
          e.preventDefault();
          $.ajax({
            type:'POST',
            url:'/',
            data:{
              todo:{prop.link}.value()
            },
            success:function()
            {
              alert('saved');
            }
          })
        });
</script>
</>