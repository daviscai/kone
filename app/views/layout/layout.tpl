<!doctype html>
<html>
<head>
<meta name="charset" content="utf-8" />
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="renderer" content="webkit">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>{{title}}</title>
{% block head %}{% endblock %}
</head>
<body>
{% include "./header.tpl" %}
{% block body %}{% endblock %}
{% include "./footer.tpl" %}
</body>
</html>
