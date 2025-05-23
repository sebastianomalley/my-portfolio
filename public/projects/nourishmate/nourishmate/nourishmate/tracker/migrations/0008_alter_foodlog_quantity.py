# Generated by Django 5.2 on 2025-05-06 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0007_foodlog_calcium_foodlog_calories_foodlog_carbs_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='foodlog',
            name='quantity',
            field=models.CharField(choices=[('cup', 'Cup(s)'), ('oz', 'Ounce(s)'), ('g', 'Gram(s)'), ('tbsp', 'Tablespoon(s)'), ('tsp', 'Teaspoon(s)'), ('ml', 'Milliliter(s)'), ('l', 'Liter(s)'), ('slice', 'Slice(s)'), ('piece', 'Piece(s)')], max_length=50),
        ),
    ]
