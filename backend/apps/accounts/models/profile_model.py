import os
import random
import string

from django.db import models
from django.dispatch import receiver
from django.utils.text import slugify
from django.db.models.signals import post_save
from django.utils.translation import gettext as _

from apps.accounts.models.user_model import User


def slugify_text(content):
    content = content.replace(' ', '-')
    content = content.replace('_', '-').lower()
    content = slugify(content)
    return content


def user_dir_path(instance, filename):
    fname, extension = os.path.splitext(filename)
    rand = ''.join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(8)
    )
    filename = f'{slugify_text(fname)}-{rand}.{extension}'

    return f'users/{filename}'


class GenderChoices(models.TextChoices):
    MALE = 'male', _('Male')
    FEMALE = 'female', _('Female')
    OTHERS = 'others', _('Others')


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    full_name = models.CharField(_('Full Name'), max_length=80, blank=True)
    gender = models.CharField(
        _('Gender'),
        max_length=10,
        choices=GenderChoices.choices,
        blank=True,
        default=GenderChoices.OTHERS,
    )
    profile_picture = models.ImageField(
        _('Profile Picture'), upload_to=user_dir_path, null=True, blank=True
    )
    address = models.CharField(_('Address'), max_length=225, blank=True)
    date_of_birth = models.DateField(_('Date of Birth'), null=True, blank=True)
    phone = models.CharField(_('Phone'), max_length=20)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    try:
        if created:
            Profile.objects.create(user=instance)
    except BaseException:
        raise ValueError(_('Cannot create user profile'))


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        if not instance.is_active:
            instance.profile.save()
    except BaseException:
        raise ValueError(_('Cannot save user profile'))
