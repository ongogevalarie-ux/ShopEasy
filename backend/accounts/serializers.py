from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Profile


class RegisterSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True
    )

    phone = serializers.CharField(
        required=False,
        allow_blank=True
    )

    address = serializers.CharField(
        required=False,
        allow_blank=True
    )


    class Meta:

        model = User

        fields = [
            'id',
            'username',
            'email',
            'password',
            'phone',
            'address',
        ]


    def create(
        self,
        validated_data
    ):

        phone = validated_data.pop(
            'phone',
            ''
        )

        address = validated_data.pop(
            'address',
            ''
        )


        user = User.objects.create_user(
            username=validated_data[
                'username'
            ],

            email=validated_data[
                'email'
            ],

            password=validated_data[
                'password'
            ]
        )


        user.profile.phone = phone

        user.profile.address = address

        user.profile.save()


        return user